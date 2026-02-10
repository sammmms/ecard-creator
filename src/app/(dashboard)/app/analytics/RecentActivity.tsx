"use client";

import { useState } from "react";

interface ActivityEvent {
  id: string;
  type: string;
  createdAt: string;
  greeting: { title: string | null; slug: string };
}

function formatEventType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const PAGE_SIZE = 10;

export default function RecentActivity({
  events,
}: {
  events: ActivityEvent[];
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const paged = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (events.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
        No events recorded yet. Share your greetings to start seeing activity.
      </div>
    );
  }

  return (
    <>
      <div className="glass-card rounded-xl divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
        {paged.map((event) => (
          <div
            key={event.id}
            className="flex items-start sm:items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm">
                {formatEventType(event.type)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {event.greeting.title || "Untitled"}{" "}
                <span className="text-gray-400 dark:text-gray-500">
                  /{event.greeting.slug}
                </span>
              </p>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap shrink-0">
              {new Date(event.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
