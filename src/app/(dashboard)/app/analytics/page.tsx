import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import PerGreetingStats from "./PerGreetingStats";
import RecentActivity from "./RecentActivity";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Fetch all analytics data in parallel
  const [
    totalGreetings,
    publishedCount,
    draftCount,
    trialCount,
    totalViews,
    totalShares,
    totalWishes,
    donationAggregate,
    recentEvents,
    greetingsWithStats,
  ] = await Promise.all([
    // Total greetings count
    db.greeting.count({ where: { userId } }),

    // Published count
    db.greeting.count({ where: { userId, status: "published" } }),

    // Draft count
    db.greeting.count({ where: { userId, status: "draft" } }),

    // Trial count
    db.greeting.count({ where: { userId, isTrial: true } }),

    // Total page views
    db.event.count({
      where: {
        type: "view",
        greeting: { userId },
      },
    }),

    // Total shares (any event type containing "share")
    db.event.count({
      where: {
        type: { contains: "share" },
        greeting: { userId },
      },
    }),

    // Total wishes / submissions
    db.publicSubmission.count({
      where: {
        greeting: { userId },
      },
    }),

    // Total donation amount (sum of paid DonationPayments)
    db.donationPayment.aggregate({
      _sum: { amount: true },
      where: {
        status: "paid",
        greeting: { userId },
      },
    }),

    // Recent events (last 20 across all greetings)
    db.event.findMany({
      where: {
        greeting: { userId },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        greeting: {
          select: { title: true, slug: true },
        },
      },
    }),

    // Per-greeting stats
    db.greeting.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        isTrial: true,
        _count: {
          select: {
            events: true,
            publicSubmissions: true,
          },
        },
      },
    }),
  ]);

  const totalDonations = donationAggregate._sum.amount || 0;

  // Build per-greeting view/share counts
  // We need individual counts per greeting, so let's get them
  const greetingIds = greetingsWithStats.map((g) => g.id);

  const [viewCounts, shareCounts] = await Promise.all([
    db.event.groupBy({
      by: ["greetingId"],
      where: {
        greetingId: { in: greetingIds },
        type: "view",
      },
      _count: true,
    }),
    db.event.groupBy({
      by: ["greetingId"],
      where: {
        greetingId: { in: greetingIds },
        type: { contains: "share" },
      },
      _count: true,
    }),
  ]);

  const viewMap = new Map(viewCounts.map((v) => [v.greetingId, v._count]));
  const shareMap = new Map(shareCounts.map((s) => [s.greetingId, s._count]));

  const perGreetingStats = greetingsWithStats.map((g) => ({
    id: g.id,
    title: g.title || "Untitled",
    slug: g.slug,
    status: g.status,
    isTrial: g.isTrial,
    views: viewMap.get(g.id) || 0,
    shares: shareMap.get(g.id) || 0,
    wishes: g._count.publicSubmissions,
  }));

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track performance across all your greetings.
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Views
          </p>
          <p className="text-3xl font-bold mt-2">
            <span className="text-theme-gradient">
              {totalViews.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Shares
          </p>
          <p className="text-3xl font-bold mt-2">
            <span className="text-theme-gradient">
              {totalShares.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Wishes
          </p>
          <p className="text-3xl font-bold mt-2">
            <span className="text-theme-gradient">
              {totalWishes.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="glass-card rounded-xl p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Donations
          </p>
          <p className="text-3xl font-bold mt-2">
            <span className="text-theme-gradient">
              {formatCurrency(totalDonations)}
            </span>
          </p>
        </div>
      </div>

      {/* Greeting Counts by Status */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Greetings Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold mt-1">{totalGreetings}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published
            </p>
            <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
              {publishedCount}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Draft</p>
            <p className="text-2xl font-bold mt-1 text-gray-600 dark:text-gray-400">
              {draftCount}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">Trial</p>
            <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
              {trialCount}
            </p>
          </div>
        </div>
      </div>

      {/* Per-Greeting Stats with clickable wishes */}
      <PerGreetingStats stats={perGreetingStats} />

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <RecentActivity
          events={recentEvents.map((e) => ({
            id: e.id,
            type: e.type,
            createdAt: e.createdAt.toISOString(),
            greeting: {
              title: e.greeting.title,
              slug: e.greeting.slug,
            },
          }))}
        />
      </div>
    </div>
  );
}
