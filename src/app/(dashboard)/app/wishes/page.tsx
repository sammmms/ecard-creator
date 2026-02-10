"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { motion } from "framer-motion";
import { DonationStatus } from "@/lib/constants";
import {
  Heart,
  Gift,
  MessageCircle,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import * as anim from "@/lib/animations";
import Button from "@/components/Button";

interface WishItem {
  id: string;
  name: string | null;
  comment: string | null;
  imageUrl: string | null;
  createdAt: string;
  greeting: { id: string; title: string | null; slug: string };
  donation: { id: string; amount: number; status: string } | null;
}

interface DonationItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  donorName: string | null;
  donorMessage: string | null;
  createdAt: string;
  greeting: { id: string; title: string | null; slug: string };
}

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-red-400 to-rose-500",
];

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    paid: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    failed: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[status] || colors.pending}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const PAGE_SIZE = 20;

export default function WishesPage() {
  return (
    <Suspense>
      <WishesPageInner />
    </Suspense>
  );
}

function WishesPageInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "donations" ? 1 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [wishPage, setWishPage] = useState(0);

  // Wishes data
  const { data: wishesData, isLoading: wishesLoading } = useSWR<{
    wishes: WishItem[];
    total: number;
  }>(`/api/wishes?limit=${PAGE_SIZE}&offset=${wishPage * PAGE_SIZE}`, fetcher);
  const wishes = wishesData?.wishes || [];
  const wishTotal = wishesData?.total || 0;

  // Donations data
  const {
    data: donations = [],
    isLoading: donationsLoading,
    mutate: mutateDonations,
  } = useSWR<DonationItem[]>("/api/donations", fetcher);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateDonation = useCallback(
    async (id: string, status: DonationStatus) => {
      setUpdatingId(id);
      try {
        const res = await fetch(`/api/donations/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          mutateDonations();
        }
      } finally {
        setUpdatingId(null);
      }
    },
    [mutateDonations],
  );

  const tabs = [
    { label: "All Wishes", icon: MessageCircle, count: wishTotal },
    {
      label: "Donations",
      icon: Gift,
      count: donations.length,
    },
  ];

  const wishPages = Math.ceil(wishTotal / PAGE_SIZE);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div variants={anim.fadeInDown}>
        <h1 className="text-3xl font-bold">Wishes & Donations</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View wishes from your greetings and manage donations.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={anim.fadeInUp}>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === i
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {tab.count > 0 && (
                  <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Wishes Tab */}
      {activeTab === 0 && (
        <motion.div key="wishes-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {wishesLoading ? (
            <div className="glass-card rounded-xl p-8 flex justify-center">
              <Loader2 size={28} className="animate-spin text-gray-400" />
            </div>
          ) : wishes.length === 0 ? (
            <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
              <Heart
                size={40}
                className="text-gray-300 dark:text-gray-600 mb-3"
              />
              <p className="font-medium text-gray-500">No wishes yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Wishes will appear here when people send them to your greetings.
              </p>
            </div>
          ) : (
            <>
              <div className="glass-card rounded-xl divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                {wishes.map((wish, i) => {
                  const name = wish.name || "Anonymous";
                  const initial = name.charAt(0).toUpperCase();
                  const gradientIdx =
                    hashCode(wish.id) % AVATAR_GRADIENTS.length;
                  return (
                    <motion.div
                      key={wish.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 px-5 py-4"
                    >
                      <div
                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[gradientIdx]} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <span className="text-white text-sm font-bold">
                          {initial}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{name}</p>
                          {wish.donation && wish.donation.amount > 0 && (
                            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                              {formatCurrency(wish.donation.amount)}
                            </span>
                          )}
                          {wish.donation && (
                            <StatusBadge status={wish.donation.status} />
                          )}
                        </div>
                        {wish.comment && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {wish.comment}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {wish.greeting.title || "Untitled"} &middot;{" "}
                          {new Date(wish.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {wishPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setWishPage((p) => Math.max(0, p - 1))}
                    disabled={wishPage === 0}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {wishPage + 1} of {wishPages}
                  </span>
                  <button
                    onClick={() =>
                      setWishPage((p) => Math.min(wishPages - 1, p + 1))
                    }
                    disabled={wishPage >= wishPages - 1}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Donations Tab */}
      {activeTab === 1 && (
        <motion.div key="donations-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          {donationsLoading ? (
            <div className="glass-card rounded-xl p-8 flex justify-center">
              <Loader2 size={28} className="animate-spin text-gray-400" />
            </div>
          ) : donations.length === 0 ? (
            <div className="glass-card rounded-xl p-12 flex flex-col items-center text-center">
              <Gift
                size={40}
                className="text-gray-300 dark:text-gray-600 mb-3"
              />
              <p className="font-medium text-gray-500">No donations yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Donations will appear here when people donate through your
                greetings.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                        Donor
                      </th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                        Greeting
                      </th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="text-center px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-center px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                        Date
                      </th>
                      <th className="text-center px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {donations.map((d, i) => (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium">
                            {d.donorName || "Anonymous"}
                          </p>
                          {d.donorMessage && (
                            <p className="text-xs text-gray-400 truncate max-w-48">
                              {d.donorMessage}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3 text-gray-500">
                          {d.greeting.title || "Untitled"}
                        </td>
                        <td className="px-5 py-3 text-right font-medium">
                          {formatCurrency(d.amount)}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="px-5 py-3 text-center text-gray-400 text-xs">
                          {new Date(d.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {d.status === DonationStatus.PENDING ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                variant="icon"
                                size="sm"
                                onClick={() => updateDonation(d.id, DonationStatus.PAID)}
                                disabled={updatingId === d.id}
                                className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                title="Approve"
                              >
                                {updatingId === d.id ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Check size={14} />
                                )}
                              </Button>
                              <Button
                                variant="icon"
                                size="sm"
                                onClick={() => updateDonation(d.id, DonationStatus.FAILED)}
                                disabled={updatingId === d.id}
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Reject"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {donations.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {d.donorName || "Anonymous"}
                          </p>
                          <StatusBadge status={d.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {d.greeting.title || "Untitled"}
                        </p>
                        {d.donorMessage && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {d.donorMessage}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-sm shrink-0 ml-3">
                        {formatCurrency(d.amount)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-400">
                        {new Date(d.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {d.status === DonationStatus.PENDING && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateDonation(d.id, DonationStatus.FAILED)}
                            disabled={updatingId === d.id}
                            className="text-xs"
                          >
                            <X size={12} className="mr-1" />
                            Reject
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateDonation(d.id, DonationStatus.PAID)}
                            disabled={updatingId === d.id}
                            className="text-xs"
                          >
                            {updatingId === d.id ? (
                              <Loader2
                                size={12}
                                className="animate-spin mr-1"
                              />
                            ) : (
                              <Check size={12} className="mr-1" />
                            )}
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
