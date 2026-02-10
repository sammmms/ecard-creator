import clsx from "clsx";

interface ShimmerProps {
  className?: string;
}

export default function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800",
        className,
      )}
    />
  );
}

/** Skeleton for a stat card (dashboard overview) */
export function StatCardSkeleton() {
  return (
    <div className="glass-card p-6 rounded-xl space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-16" />
        </div>
        <Shimmer className="w-12 h-12 rounded-xl" />
      </div>
      <Shimmer className="h-3 w-28" />
    </div>
  );
}

/** Skeleton for a template card */
export function TemplateCardSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Shimmer className="aspect-video rounded-none" />
      <div className="p-4 space-y-2">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-4 w-20" />
        <Shimmer className="h-3 w-full" />
      </div>
    </div>
  );
}

/** Skeleton for a table row */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Shimmer className={`h-4 ${i === 0 ? "w-32" : "w-20"}`} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton for a list item row */
export function ListRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="space-y-1.5 flex-1 mr-3">
        <Shimmer className="h-4 w-40" />
        <Shimmer className="h-3 w-24" />
      </div>
      <Shimmer className="h-6 w-20 rounded-full" />
    </div>
  );
}

/** Skeleton for the greeting edit form */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-1.5">
      <Shimmer className="h-4 w-28" />
      <Shimmer className="h-10 w-full" />
    </div>
  );
}
