"use client";

import { useState } from "react";
import { GreetingStatus } from "@/lib/constants";
import WishesModal from "@/components/WishesModal";

interface GreetingStat {
  id: string;
  title: string;
  slug: string;
  status: string;
  isTrial: boolean;
  views: number;
  shares: number;
  wishes: number;
  maxFreeViews: number;
}

export default function PerGreetingStats({ stats }: { stats: GreetingStat[] }) {
  const [wishesModal, setWishesModal] = useState({
    isOpen: false,
    greetingId: "",
    greetingTitle: "",
  });

  const openWishesModal = (id: string, title: string) => {
    setWishesModal({ isOpen: true, greetingId: id, greetingTitle: title });
  };

  if (stats.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Per-Greeting Performance
      </h2>

      {/* Desktop table */}
      <div className="hidden md:block glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Greeting
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Views
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Shares
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">
                  Wishes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium">{g.title}</div>
                    <div className="text-xs text-gray-400">/{g.slug}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        g.status === GreetingStatus.PUBLISHED
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : g.status === GreetingStatus.DRAFT
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {g.isTrial ? "trial" : g.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    <span>{g.views}</span>
                    {g.isTrial && (
                      <div className="text-[10px] text-gray-400 font-normal">
                        {g.views}/{g.maxFreeViews} free
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {g.shares}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => openWishesModal(g.id, g.title)}
                      className="font-medium link-theme hover:underline cursor-pointer"
                    >
                      {g.wishes}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {stats.map((g) => (
          <div key={g.id} className="glass-card rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{g.title}</div>
                <div className="text-xs text-gray-400">/{g.slug}</div>
              </div>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${
                  g.status === GreetingStatus.PUBLISHED
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : g.status === GreetingStatus.DRAFT
                      ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {g.isTrial ? "trial" : g.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-lg font-bold">{g.views}</p>
                <p className="text-[10px] text-gray-400 uppercase">Views</p>
                {g.isTrial && (
                  <p className="text-[10px] text-gray-400">{g.views}/{g.maxFreeViews} free</p>
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{g.shares}</p>
                <p className="text-[10px] text-gray-400 uppercase">Shares</p>
              </div>
              <button
                onClick={() => openWishesModal(g.id, g.title)}
                className="text-center cursor-pointer"
              >
                <p className="text-lg font-bold link-theme">{g.wishes}</p>
                <p className="text-[10px] text-gray-400 uppercase">Wishes</p>
              </button>
            </div>
          </div>
        ))}
      </div>

      <WishesModal
        isOpen={wishesModal.isOpen}
        onClose={() => setWishesModal({ isOpen: false, greetingId: "", greetingTitle: "" })}
        greetingId={wishesModal.greetingId}
        greetingTitle={wishesModal.greetingTitle}
      />
    </div>
  );
}
