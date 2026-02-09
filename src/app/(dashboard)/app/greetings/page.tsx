"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Edit, CreditCard, Layers } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import * as anim from "@/lib/animations";
import PageLoader from "@/components/PageLoader";
import StatusBadge from "@/components/StatusBadge";

interface Greeting {
  id: string;
  title: string;
  slug: string;
  status: string;
  template: { name: string };
  createdAt: string;
}

export default function GreetingsPage() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/greetings")
      .then((res) => res.json())
      .then((data) => {
        setGreetings(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <PageLoader />;

  return (
    <motion.div
      className="space-y-6"
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
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/app/templates"
            className="btn-theme text-white px-5 py-2.5 rounded-lg transition-colors font-medium text-sm inline-flex items-center gap-2"
          >
            <span>+</span> New Greeting
          </Link>
        </motion.div>
      </motion.div>

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
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center"
                >
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
    </motion.div>
  );
}
