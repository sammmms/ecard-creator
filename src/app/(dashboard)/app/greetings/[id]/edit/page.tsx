"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Save,
  ArrowLeft,
  Lock,
  Eye,
  Upload,
  Trash2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Select from "@/components/Select";
import UpgradeModal from "@/components/UpgradeModal";
import Button from "@/components/Button";
import Shimmer, { FormFieldSkeleton } from "@/components/Shimmer";
import ToggleSwitch from "@/components/ToggleSwitch";
import * as anim from "@/lib/animations";
import toast from "react-hot-toast";

interface Greeting {
  id: string;
  title: string;
  senderNameDefault: string;
  messageDefault: string;
  companyLogoUrl: string;
  layoutVariant: string;
  submissionsEnabled: boolean;
  donationEnabled: boolean;
  donationMode: string;
  isTrial: boolean;
  trialExpiresAt: string | null;
  slug: string;
  template?: {
    componentSlug?: string;
    premiumPrice?: number | null;
  };
}

export default function EditGreetingPage() {
  const router = useRouter();
  const params = useParams();
  const { data: greeting, isLoading: loading } = useSWR<Greeting>(
    `/api/greetings/${params.id}`,
    fetcher,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<Partial<Greeting>>({});
  const [formInit, setFormInit] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const isTrial = greeting?.isTrial === true;

  // Initialize form data once greeting loads
  useEffect(() => {
    if (greeting && !formInit) {
      const isValentine = greeting.template?.componentSlug === "valentine-rose";
      setFormData({
        title: greeting.title || "",
        senderNameDefault: greeting.senderNameDefault || "",
        messageDefault: greeting.messageDefault || "",
        companyLogoUrl: greeting.companyLogoUrl || "",
        layoutVariant: greeting.layoutVariant || (isValentine ? "red" : "A"),
        submissionsEnabled: greeting.submissionsEnabled || false,
        donationEnabled: greeting.donationEnabled || false,
        donationMode: greeting.donationMode || "none",
      });
      setFormInit(true);
    }
  }, [greeting, formInit]);

  const handleUpgradeTrigger = (trigger: string) => {
    setUpgradeTrigger(trigger);
    setShowUpgrade(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTrial) {
      handleUpgradeTrigger("logo_upload");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setFormData({ ...formData, companyLogoUrl: url });
      }
    } catch (err) {
      console.error(err);
    }
    setUploadingLogo(false);
  };

  const handleRemoveLogo = async () => {
    if (formData.companyLogoUrl) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.companyLogoUrl }),
      }).catch(() => {});
      setFormData({ ...formData, companyLogoUrl: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/greetings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const txt = await res.text();
        toast.error(`Error: ${txt}`);
        setSaving(false);
        return;
      }

      setSaving(false);
      setSaved(true);
      toast.success("Changes saved!");
      setTimeout(() => router.push("/app/greetings"), 800);
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-4 w-64" />
        </div>
        <div className="glass-card p-6 rounded-xl space-y-5">
          <div className="space-y-1.5">
            <Shimmer className="h-4 w-28" />
            <Shimmer className="h-20 w-full rounded-lg" />
          </div>
          <FormFieldSkeleton />
          <FormFieldSkeleton />
          <div className="space-y-1.5">
            <Shimmer className="h-4 w-28" />
            <Shimmer className="h-28 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
          <div className="space-y-3 pt-2">
            <Shimmer className="h-6 w-48" />
            <Shimmer className="h-6 w-48" />
          </div>
          <div className="pt-4 flex justify-end">
            <Shimmer className="h-10 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    );
  if (!greeting) return <div>Greeting not found</div>;

  return (
    <>
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial="hidden"
        animate="visible"
        variants={anim.staggerContainer}
      >
        <motion.div variants={anim.fadeInDown}>
          <Link
            href="/app/greetings"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft size={14} /> Back to greetings
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Edit Greeting</h1>
            {isTrial && (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-medium">
                Trial
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">
            Customize your greeting card details.
          </p>
        </motion.div>

        {/* Trial notice */}
        {isTrial && (
          <motion.div
            variants={anim.fadeInUp}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300"
          >
            <strong>Trial Greeting:</strong> Some features are locked. Upgrade
            to a paid template to unlock custom logo, donations, and more.
            <button
              onClick={() => handleUpgradeTrigger("trial_banner")}
              className="ml-2 underline underline-offset-2 font-bold hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
            >
              Upgrade Now
            </button>
          </motion.div>
        )}

        {/* Trial expiry countdown */}
        {isTrial &&
          greeting.trialExpiresAt &&
          (() => {
            const expiresAt = new Date(greeting.trialExpiresAt);
            const now = new Date();
            const diffMs = expiresAt.getTime() - now.getTime();
            const isExpired = diffMs <= 0;
            const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            return (
              <motion.div
                variants={anim.fadeInUp}
                className={`border rounded-xl p-4 text-sm flex items-center gap-3 ${
                  isExpired
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300"
                    : daysLeft <= 2
                      ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300"
                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300"
                }`}
              >
                <Clock size={16} className="shrink-0" />
                <span>
                  {isExpired ? (
                    <>
                      <strong>Trial expired.</strong> This greeting is no longer
                      visible to the public. Upgrade to restore access.
                    </>
                  ) : daysLeft === 1 ? (
                    <>
                      <strong>Trial expires tomorrow.</strong> After expiry, the
                      public link will stop working.
                    </>
                  ) : (
                    <>
                      <strong>Trial expires in {daysLeft} days.</strong> After
                      expiry, the public link will stop working.
                    </>
                  )}
                </span>
              </motion.div>
            );
          })()}

        <motion.form
          onSubmit={handleSubmit}
          variants={anim.fadeInUp}
          className="glass-card p-6 rounded-xl space-y-6"
        >
          <div className="grid gap-5">
            {/* Company Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                Company Logo
                {isTrial && <Lock size={12} className="text-amber-500" />}
              </label>
              {formData.companyLogoUrl ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={formData.companyLogoUrl}
                    alt="Logo"
                    width={56}
                    height={56}
                    unoptimized
                    className="w-14 h-14 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={handleRemoveLogo}
                    icon={<Trash2 size={14} />}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed rounded-lg text-sm transition cursor-pointer ${
                    isTrial
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 opacity-60"
                      : "border-gray-300 dark:border-gray-600 text-gray-500 hover:border-primary hover:text-primary"
                  }`}
                  onClick={(e) => {
                    if (isTrial) {
                      e.preventDefault();
                      handleUpgradeTrigger("logo_upload");
                    }
                  }}
                >
                  {uploadingLogo ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isTrial
                    ? "Logo locked — Upgrade to unlock"
                    : "Upload logo (PNG, JPG, WebP)"}
                  {!isTrial && (
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  )}
                </label>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-1.5">
                Internal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium mb-1.5">
                Default Sender Name
              </label>
              <input
                type="text"
                value={formData.senderNameDefault}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    senderNameDefault: e.target.value,
                  })
                }
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-1.5">
                Default Message
              </label>
              <textarea
                value={formData.messageDefault}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    messageDefault: e.target.value,
                  })
                }
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-28 input-focus-theme outline-none transition resize-none"
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                  Layout Variant
                  {isTrial && <Lock size={12} className="text-amber-500" />}
                </label>
                {isTrial ? (
                  <button
                    type="button"
                    onClick={() => handleUpgradeTrigger("layout_variant")}
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-left text-sm text-gray-400 flex items-center justify-between opacity-60"
                  >
                    <span>{greeting.template?.componentSlug === "valentine-rose" ? "Red" : "Variant A"}</span>
                    <Lock size={14} className="text-amber-500" />
                  </button>
                ) : (
                  <Select
                    value={formData.layoutVariant || (greeting.template?.componentSlug === "valentine-rose" ? "red" : "A")}
                    onChange={(value) =>
                      setFormData({ ...formData, layoutVariant: value })
                    }
                    options={
                      greeting.template?.componentSlug === "valentine-rose"
                        ? [
                            { value: "red", label: "Red" },
                            { value: "pink", label: "Pink" },
                            { value: "maroon", label: "Maroon" },
                          ]
                        : [
                            { value: "A", label: "Variant A" },
                            { value: "B", label: "Variant B" },
                          ]
                    }
                  />
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                  Donation Mode
                  {isTrial && <Lock size={12} className="text-amber-500" />}
                </label>
                {isTrial ? (
                  <button
                    type="button"
                    onClick={() => handleUpgradeTrigger("donation_mode")}
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-left text-sm text-gray-400 flex items-center justify-between opacity-60"
                  >
                    <span>None</span>
                    <Lock size={14} className="text-amber-500" />
                  </button>
                ) : (
                  <Select
                    value={formData.donationMode || "none"}
                    onChange={(value) =>
                      setFormData({ ...formData, donationMode: value })
                    }
                    options={[
                      { value: "none", label: "None" },
                      { value: "manual", label: "Manual (QR)" },
                      { value: "platform", label: "Platform (Xendit)" },
                    ]}
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              className="space-y-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ToggleSwitch
                checked={isTrial ? false : formData.donationEnabled || false}
                onChange={(checked) => {
                  if (isTrial) return;
                  setFormData({ ...formData, donationEnabled: checked });
                }}
                disabled={isTrial}
                label="Enable Donations"
                icon={
                  isTrial ? (
                    <Lock size={12} className="text-amber-500" />
                  ) : undefined
                }
                onClick={
                  isTrial
                    ? (e) => {
                        e.preventDefault();
                        handleUpgradeTrigger("donation_toggle");
                      }
                    : undefined
                }
              />

              <ToggleSwitch
                checked={formData.submissionsEnabled || false}
                onChange={(checked) =>
                  setFormData({ ...formData, submissionsEnabled: checked })
                }
                label="Enable Public Submissions"
              />
            </motion.div>
          </div>

          <motion.div
            className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Link
              href={`/g/${greeting.slug}`}
              target="_blank"
              className="text-sm text-gray-500 hover:text-primary flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye size={14} /> Preview public page
            </Link>

            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                saved ? "bg-green-600 text-white" : "btn-theme text-white"
              }`}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : saved ? (
                <>Saved!</>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger={upgradeTrigger}
        greetingId={greeting.id}
        templatePrice={greeting.template?.premiumPrice}
      />
    </>
  );
}
