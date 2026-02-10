"use client";

import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { motion } from "framer-motion";
import { Save, CheckCircle, Loader2, CreditCard } from "lucide-react";
import * as anim from "@/lib/animations";
import Shimmer, { FormFieldSkeleton } from "@/components/Shimmer";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  email: string;
  companyName: string | null;
}

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { isLoading } = useSWR<UserProfile>(
    "/api/user/profile",
    fetcher,
    {
      onSuccess: (data) => {
        setCompanyName(data.companyName || "");
      },
    },
  );

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });
      if (!res.ok) {
        toast.error("Failed to save");
        return;
      }
      setSaved(true);
      toast.success("Settings saved!");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="max-w-4xl space-y-6">
        <div className="space-y-2">
          <Shimmer className="h-8 w-40" />
          <Shimmer className="h-4 w-56" />
        </div>
        <div className="glass-card rounded-xl p-6 space-y-5">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
      </div>
    );

  return (
    <motion.div
      className="max-w-4xl space-y-6"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div variants={anim.fadeInDown}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings.</p>
      </motion.div>

      <motion.div
        variants={anim.scaleIn}
        className="glass-card rounded-xl p-6 space-y-5"
      >
        <h3 className="text-lg font-semibold">Company Profile</h3>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Company Name
          </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
            placeholder="Your Company Name"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            This will be shown as the default sender name on your greeting
            cards.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: saving ? 1 : 1.02 }}
            whileTap={{ scale: saving ? 1 : 0.98 }}
            className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-60 ${
              saved ? "bg-green-600 text-white" : "btn-theme text-white"
            }`}
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : saved ? (
              <>
                <CheckCircle size={18} /> Saved!
              </>
            ) : (
              <>
                <Save size={18} /> Save
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={anim.scaleIn}>
        <Link
          href="/app/settings/payments"
          className="glass-card rounded-xl p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-theme-primary/10 flex items-center justify-center">
            <CreditCard size={20} className="text-theme-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium group-hover:text-theme-primary transition-colors">
              Payment Settings
            </p>
            <p className="text-sm text-gray-500">
              Configure how you receive donations.
            </p>
          </div>
          <span className="text-gray-400 group-hover:text-theme-primary transition-colors">
            &rarr;
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
