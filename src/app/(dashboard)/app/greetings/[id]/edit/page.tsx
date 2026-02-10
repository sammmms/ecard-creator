"use client";

import { useState, useCallback, useRef, type ChangeEvent } from "react";
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
  Music,
  ChevronDown,
  Type,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Select from "@/components/Select";
import UpgradeModal from "@/components/UpgradeModal";
import Button from "@/components/Button";
import Shimmer, { FormFieldSkeleton } from "@/components/Shimmer";
import ToggleSwitch from "@/components/ToggleSwitch";
import Collapsible from "@/components/Collapsible";
import * as anim from "@/lib/animations";
import toast from "react-hot-toast";
import { TemplateRenderer } from "@/components/templates";
import GreetingPageWrapper from "@/components/GreetingPageWrapper";
import { MUSIC_TRACKS, getTrackById } from "@/lib/music";

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
  musicTrackId: string | null;
  slug: string;
  template?: {
    componentSlug?: string;
    event?: string;
    premiumPrice?: number | null;
  };
}

export default function EditGreetingPage() {
  const router = useRouter();
  const params = useParams();
  const { data: greeting, isLoading: loading, mutate } = useSWR<Greeting>(
    `/api/greetings/${params.id}`,
    fetcher,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<Partial<Greeting>>({});
  const [formInitId, setFormInitId] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isTrial = greeting?.isTrial === true;

  // Initialize form data once greeting loads
  if (greeting && formInitId !== greeting.id) {
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
      musicTrackId: greeting.musicTrackId || null,
    });
    setFormInitId(greeting.id);
  }

  // Auto-save with debounce
  const autoSave = useCallback(
    (newData: Partial<Greeting>) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/greetings/${params.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData),
          });
        } catch {
          // Silent fail for auto-save
        }
      }, 1000);
    },
    [params.id],
  );

  const updateField = useCallback(
    (field: string, value: string | boolean | null) => {
      const newData = { ...formData, [field]: value };
      setFormData(newData);
      autoSave(newData);
    },
    [formData, autoSave],
  );

  // Handle inline field changes from template
  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      updateField(field, value);
    },
    [updateField],
  );

  const handleUpgradeTrigger = (trigger: string) => {
    setUpgradeTrigger(trigger);
    setShowUpgrade(true);
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
        updateField("companyLogoUrl", url);
      }
    } catch (err) {
      console.error(err);
    }
    setUploadingLogo(false);
    // Reset the input so the same file can be re-selected
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleLogoClick = () => {
    if (isTrial) {
      handleUpgradeTrigger("logo_upload");
      return;
    }
    logoInputRef.current?.click();
  };

  const handleRemoveLogo = async () => {
    if (formData.companyLogoUrl) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.companyLogoUrl }),
      }).catch(() => {});
      updateField("companyLogoUrl", "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
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
      mutate();
      setTimeout(() => router.push("/app/greetings"), 800);
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  // Music track info
  const selectedTrack = getTrackById(formData.musicTrackId as string);
  const templateEvent = greeting?.template?.event || "cny";
  const filteredTracks = MUSIC_TRACKS.filter(
    (t) => t.category === "all" || t.category === templateEvent || t.category === "general",
  );

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

  // Build greeting data for the preview template
  const previewGreeting = {
    id: greeting.id,
    title: formData.title || "",
    senderNameDefault: formData.senderNameDefault || "",
    messageDefault: formData.messageDefault || "",
    companyLogoUrl: formData.companyLogoUrl || undefined,
    isTrial: greeting.isTrial,
    submissionsEnabled: formData.submissionsEnabled || false,
    donationEnabled: formData.donationEnabled || false,
    donationMode: formData.donationMode || "none",
    slug: greeting.slug,
    layoutVariant: formData.layoutVariant || undefined,
  };

  return (
    <>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={anim.staggerContainer}
      >
        {/* Header */}
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
            Click on text in the preview to edit inline. Use the sidebar for other settings.
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

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Preview Panel */}
          {greeting.template?.componentSlug && (
            <motion.div
              variants={anim.fadeInUp}
              className="lg:flex-1 h-[650px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative"
              style={{ contain: "paint" }}
            >
              <div className="absolute top-3 left-3 z-50 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                Live Preview — Click text to edit
              </div>
              {/* Hidden file input for logo upload (shared between sidebar & preview) */}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="h-full">
                <GreetingPageWrapper
                  greeting={previewGreeting}
                  isPreview
                  musicSrc={selectedTrack?.src || undefined}
                >
                  <TemplateRenderer
                    componentSlug={greeting.template.componentSlug}
                    greeting={previewGreeting}
                    isEditing
                    onFieldChange={handleFieldChange}
                    onLogoClick={handleLogoClick}
                  />
                </GreetingPageWrapper>
              </div>
            </motion.div>
          )}

          {/* Settings Sidebar */}
          <motion.form
            onSubmit={handleSubmit}
            variants={anim.fadeInUp}
            className="lg:w-[340px] shrink-0 glass-card p-5 rounded-xl space-y-5 h-fit"
          >
            <h2 className="font-bold text-base">Settings</h2>

            {/* Greeting Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Greeting name
              </label>
              <p className="text-[11px] text-gray-400 mb-1.5">
                Helps you find this greeting in your dashboard
              </p>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g., CNY 2025 Card"
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm"
              />
            </div>

            {/* Card Content (collapsible) */}
            <Collapsible
              title="Card content"
              icon={<Type size={14} />}
              description="Also editable by clicking text in the preview"
              defaultOpen
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Sender name</label>
                  <input
                    type="text"
                    value={formData.senderNameDefault || ""}
                    onChange={(e) => updateField("senderNameDefault", e.target.value)}
                    placeholder="Your company or team name"
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Greeting message</label>
                  <textarea
                    value={formData.messageDefault || ""}
                    onChange={(e) => updateField("messageDefault", e.target.value)}
                    placeholder="Write a warm greeting message..."
                    rows={3}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm resize-none"
                  />
                </div>
              </div>
            </Collapsible>

            {/* Company Logo */}
            <div>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                Company Logo
                {isTrial && <Lock size={12} className="text-amber-500" />}
              </label>
              {formData.companyLogoUrl ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={formData.companyLogoUrl}
                    alt="Logo"
                    width={48}
                    height={48}
                    unoptimized
                    className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
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
                <button
                  type="button"
                  className={`flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed rounded-lg text-xs transition cursor-pointer ${
                    isTrial
                      ? "border-gray-200 dark:border-gray-700 text-gray-400 opacity-60"
                      : "border-gray-300 dark:border-gray-600 text-gray-500 hover:border-primary hover:text-primary"
                  }`}
                  onClick={handleLogoClick}
                >
                  {uploadingLogo ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {isTrial
                    ? "Locked — Upgrade"
                    : "Upload logo"}
                </button>
              )}
            </div>

            {/* Music Selector */}
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Music size={14} /> Background Music
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMusicPicker(!showMusicPicker)}
                  className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-left text-sm flex items-center justify-between hover:border-primary/50 transition"
                >
                  <span>{selectedTrack?.name || "No Music"}</span>
                  <ChevronDown size={14} className={`transition-transform ${showMusicPicker ? "rotate-180" : ""}`} />
                </button>
                {showMusicPicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {filteredTracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          updateField("musicTrackId", track.id === "none" ? null : track.id);
                          setShowMusicPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                          (formData.musicTrackId || "none") === track.id
                            ? "bg-primary/10 text-primary font-medium"
                            : ""
                        }`}
                      >
                        {track.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Color Theme (only for templates with variants) + Donation Mode */}
            <div className="grid grid-cols-1 gap-4">
              {greeting.template?.componentSlug === "valentine-rose" && (
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-2">
                    Color theme
                    {isTrial && <Lock size={12} className="text-amber-500" />}
                  </label>
                  <p className="text-[11px] text-gray-400 mb-1.5">
                    Changes the overall color palette of your card
                  </p>
                  {isTrial ? (
                    <button
                      type="button"
                      onClick={() => handleUpgradeTrigger("layout_variant")}
                      className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-left text-sm text-gray-400 flex items-center justify-between opacity-60"
                    >
                      <span>Classic Red</span>
                      <Lock size={14} className="text-amber-500" />
                    </button>
                  ) : (
                    <Select
                      value={formData.layoutVariant || "red"}
                      onChange={(value) => updateField("layoutVariant", value)}
                      options={[
                        { value: "red", label: "Classic Red" },
                        { value: "pink", label: "Soft Pink" },
                        { value: "maroon", label: "Deep Maroon" },
                      ]}
                    />
                  )}
                </div>
              )}
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
                  <>
                    <Select
                      value={formData.donationMode === "platform" ? "none" : (formData.donationMode || "none")}
                      onChange={(value) => updateField("donationMode", value)}
                      options={[
                        { value: "none", label: "None" },
                        { value: "manual", label: "Manual (QR)" },
                      ]}
                    />
                    {greeting.donationMode === "platform" && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                        <Lock size={10} />
                        Xendit is under maintenance — please switch to Manual
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-1">
              <ToggleSwitch
                checked={isTrial ? false : formData.donationEnabled || false}
                onChange={(checked) => {
                  if (isTrial) return;
                  updateField("donationEnabled", checked);
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
                onChange={(checked) => updateField("submissionsEnabled", checked)}
                label="Enable Public Submissions"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-col gap-3">
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
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

              <Link
                href={`/g/${greeting.slug}`}
                target="_blank"
                className="text-sm text-gray-500 hover:text-primary flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye size={14} /> Preview public page
              </Link>
            </div>
          </motion.form>
        </div>
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
