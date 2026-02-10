"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Edit,
  CreditCard,
  Layers,
  Plus,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import * as anim from "@/lib/animations";
import StatusBadge from "@/components/StatusBadge";
import Shimmer, { TableRowSkeleton } from "@/components/Shimmer";
import WishesModal from "@/components/WishesModal";

interface Greeting {
  id: string;
  title: string;
  slug: string;
  status: string;
  template: { name: string };
  createdAt: string;
  _count?: {
    publicSubmissions?: number;
    donationPayments?: number;
    events?: number;
  };
}

export default function GreetingsPage() {
  const { data: greetings = [], isLoading: loading } = useSWR<Greeting[]>(
    "/api/greetings",
    fetcher,
  );
  const [wishesModal, setWishesModal] = useState({
    isOpen: false,
    greetingId: "",
    greetingTitle: "",
  });

  const openWishesModal = (id: string, title: string) => {
    setWishesModal({ isOpen: true, greetingId: id, greetingTitle: title });
  };

  if (loading)
    return (
      <div className="space-y-6 w-full max-w-full">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Shimmer className="h-8 w-48" />
            <Shimmer className="h-4 w-64" />
          </div>
          <Shimmer className="h-10 w-36 rounded-lg hidden sm:block" />
        </div>
        {/* Desktop table skeleton */}
        <div className="hidden md:block glass-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {["Title", "Template", "Status", "Wishes", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-xs font-medium text-gray-500 uppercase text-left"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={5} />
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile card skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl px-4 py-3 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5 flex-1">
                  <Shimmer className="h-4 w-40" />
                  <Shimmer className="h-3 w-28" />
                </div>
                <Shimmer className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                <Shimmer className="h-4 w-16" />
                <Shimmer className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <motion.div
      className="space-y-6 w-full max-w-full overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div
        className="flex justify-between items-center"
        variants={anim.fadeInDown}
      >
        <div>
          <h1 className="text-3xl font-bold">My Greetings</h1>
          <p className="text-gray-500 mt-1">
            Manage all your generated greeting cards.
          </p>
        </div>
        {/* Desktop button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hidden sm:block"
        >
          <Link
            href="/app/templates"
            className="btn-theme text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm inline-flex items-center gap-2"
          >
            <span>+</span> New Greeting
          </Link>
        </motion.div>
      </motion.div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <motion.div
          variants={anim.scaleIn}
          className="glass-card rounded-xl overflow-hidden"
        >
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">
                  Template
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">
                  Wishes
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {greetings.map((greeting, i) => (
                <motion.tr
                  key={greeting.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {greeting.title || "Untitled"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created{" "}
                      {new Date(greeting.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {greeting.template.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={greeting.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() =>
                        openWishesModal(
                          greeting.id,
                          greeting.title || "Untitled",
                        )
                      }
                      className="inline-flex items-center gap-1 link-theme hover:underline cursor-pointer"
                    >
                      <MessageCircle size={14} />
                      {greeting._count?.publicSubmissions || 0}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {greeting.status === "pending_payment" ||
                      greeting.status === "draft" ? (
                        <Link
                          href={`/app/greetings/${greeting.id}/pay`}
                          className="link-theme flex items-center gap-1 text-sm font-medium"
                        >
                          <CreditCard size={14} /> Pay
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={`/g/${greeting.slug}`}
                            target="_blank"
                            className="link-theme flex items-center gap-1 text-sm font-medium"
                          >
                            <ExternalLink size={14} /> View
                          </Link>
                          <Link
                            href={`/app/greetings/${greeting.id}/edit`}
                            className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm font-medium"
                          >
                            <Edit size={14} /> Edit
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {greetings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Layers size={40} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      No greetings yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1 mb-4">
                      Create your first greeting card to get started.
                    </p>
                    <Link
                      href="/app/templates"
                      className="link-theme font-medium text-sm"
                    >
                      Browse Templates →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {greetings.map((greeting, i) => (
          <motion.div
            key={greeting.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="glass-card rounded-xl px-4 py-3 sm:px-5 sm:py-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">
                  {greeting.title || "Untitled"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {greeting.template.name} &middot;{" "}
                  {new Date(greeting.createdAt).toLocaleDateString()}
                </div>
              </div>
              <StatusBadge status={greeting.status} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-y-2 pt-1 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() =>
                  openWishesModal(greeting.id, greeting.title || "Untitled")
                }
                className="text-xs link-theme flex items-center gap-1 cursor-pointer hover:underline"
              >
                <MessageCircle size={12} />
                {greeting._count?.publicSubmissions || 0} wishes
              </button>
              <div className="flex items-center gap-3">
                {greeting.status === "pending_payment" ||
                greeting.status === "draft" ? (
                  <Link
                    href={`/app/greetings/${greeting.id}/pay`}
                    className="link-theme flex items-center gap-1 text-sm font-medium"
                  >
                    <CreditCard size={14} /> Pay
                  </Link>
                ) : (
                  <>
                    <Link
                      href={`/g/${greeting.slug}`}
                      target="_blank"
                      className="link-theme flex items-center gap-1 text-sm font-medium"
                    >
                      <ExternalLink size={14} /> View
                    </Link>
                    <Link
                      href={`/app/greetings/${greeting.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 flex items-center gap-1 text-sm font-medium"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {greetings.length === 0 && (
          <motion.div
            variants={anim.scaleIn}
            className="glass-card rounded-xl px-6 py-16 text-center"
          >
            <Layers size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No greetings yet.</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">
              Create your first greeting card to get started.
            </p>
            <Link
              href="/app/templates"
              className="link-theme font-medium text-sm"
            >
              Browse Templates →
            </Link>
          </motion.div>
        )}
      </div>

      <WishesModal
        isOpen={wishesModal.isOpen}
        onClose={() =>
          setWishesModal({ isOpen: false, greetingId: "", greetingTitle: "" })
        }
        greetingId={wishesModal.greetingId}
        greetingTitle={wishesModal.greetingTitle}
      />

      {/* Mobile floating action button */}
      <Link
        href="/app/templates"
        className="sm:hidden fixed bottom-6 right-6 z-30"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full btn-theme text-white shadow-lg shadow-primary/30 flex items-center justify-center"
        >
          <Plus size={24} />
        </motion.div>
      </Link>
    </motion.div>
  );
}
