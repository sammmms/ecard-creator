import clsx from "clsx";

const statusStyles: Record<string, string> = {
  published:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  pending_payment:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusStyles[status] || statusStyles.draft,
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
