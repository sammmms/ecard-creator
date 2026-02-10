"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { motion } from "framer-motion";
import {
  Loader2,
  Save,
  ArrowLeft,
  Upload,
  Trash2,
  Music,
  ChevronDown,
  Type,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Shimmer from "@/components/Shimmer";
import ToggleSwitch from "@/components/ToggleSwitch";
import Collapsible from "@/components/Collapsible";
import UnsavedChangesGuard from "@/components/UnsavedChangesGuard";
import * as anim from "@/lib/animations";
import toast from "react-hot-toast";
import { TemplateRenderer } from "@/components/templates";
import GreetingPageWrapper from "@/components/GreetingPageWrapper";
import { MUSIC_TRACKS, getTrackById } from "@/lib/music";

interface Template {
  id: string;
  name: string;
  componentSlug: string | null;
  configJson: string;
  event: string;
  premiumPrice: number | null;
}

export default function NewGreetingPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-[400px] w-full rounded-xl" />
        </div>
      }
    >
      <NewGreetingPageContent />
    </Suspense>
  );
}

function NewGreetingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const isTrial = searchParams.get("trial") === "true";

  const { data: template, isLoading: loading } = useSWR<Template>(
    templateId ? `/api/templates?id=${templateId}` : null,
    fetcher,
  );

  // Local state — not persisted until save
  const [title, setTitle] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [layoutVariant, setLayoutVariant] = useState("red");
  const [musicTrackId, setMusicTrackId] = useState<string | null>(null);
  const [submissionsEnabled, setSubmissionsEnabled] = useState(true);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const hasChanges = !!(title || senderName || message || logoUrl);

  const filteredTracks = [
    { id: "none", name: "No Music", src: "", category: "" },
    ...MUSIC_TRACKS.filter(
      (t) => t.category === "all" || t.category === template?.event || t.category === "general",
    ),
  ];
  const selectedTrack = musicTrackId ? getTrackById(musicTrackId) : null;

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo must be under 2MB");
        return;
      }

      setUploadingLogo(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (data.url) {
          setLogoUrl(data.url);
        }
      } catch {
        toast.error("Upload failed");
      } finally {
        setUploadingLogo(false);
      }
    },
    [],
  );

  const handleLogoClick = useCallback(() => {
    if (isTrial) return;
    logoInputRef.current?.click();
  }, [isTrial]);

  const handleRemoveLogo = useCallback(() => {
    setLogoUrl("");
  }, []);

  const handleFieldChange = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case "title":
          setTitle(value);
          break;
        case "senderNameDefault":
          setSenderName(value);
          break;
        case "messageDefault":
          setMessage(value);
          break;
      }
    },
    [],
  );

  const handleSave = async () => {
    if (!templateId || saving) return;

    setSaving(true);
    try {
      // Step 1: Create the trial greeting
      const createRes = await fetch("/api/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, asTrial: true }),
      });
      const createData = await createRes.json();

      if (!createRes.ok) {
        if (createData.existingId) {
          // Already have a trial for this template
          router.replace(`/app/greetings/${createData.existingId}/edit`);
          return;
        }
        toast.error(createData.error || "Failed to create greeting");
        return;
      }

      // Step 2: Patch with local edits
      const greetingId = createData.id;
      await fetch(`/api/greetings/${greetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `Greeting - ${template?.name || "New"}`,
          senderNameDefault: senderName,
          messageDefault: message,
          companyLogoUrl: logoUrl || undefined,
          layoutVariant,
          musicTrackId,
          submissionsEnabled,
        }),
      });

      toast.success("Greeting saved!");
      router.replace(`/app/greetings/${greetingId}/edit`);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!templateId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-gray-500">No template selected.</p>
          <Link href="/app/templates" className="link-theme text-sm font-medium">
            Browse Templates
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !template) {
    return (
      <div className="space-y-6">
        <Shimmer className="h-8 w-48" />
        <Shimmer className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  const previewGreeting = {
    id: "new",
    title: title || "",
    senderNameDefault: senderName || "",
    messageDefault: message || "",
    companyLogoUrl: logoUrl || undefined,
    isTrial: true,
    submissionsEnabled,
    donationEnabled: false,
    donationMode: "none",
    slug: "new",
    layoutVariant,
  };

  return (
    <UnsavedChangesGuard hasUnsavedChanges={hasChanges && !saving}>
      <motion.div
        className="space-y-5"
        initial="hidden"
        animate="visible"
        variants={anim.staggerContainer}
      >
        {/* Header */}
        <motion.div variants={anim.fadeInDown} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app/templates"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Try {template.name}</h1>
              <p className="text-sm text-gray-500">
                Preview and customize before saving
              </p>
            </div>
          </div>
        </motion.div>

        {/* Unsaved changes hint */}
        <motion.div
          variants={anim.fadeInUp}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm"
        >
          <AlertTriangle size={14} className="shrink-0" />
          This greeting hasn&apos;t been saved yet. Changes will be lost if you leave.
        </motion.div>

        {/* Editor Layout */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Preview */}
          {template.componentSlug && (
            <motion.div variants={anim.fadeInUp} className="flex-1 min-w-0">
              <div
                className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-[650px]"
                style={{ contain: "paint" }}
              >
                <GreetingPageWrapper
                  greeting={previewGreeting}
                  paymentMethods={null}
                  donationMode="none"
                  initialWishes={[]}
                  isPreview
                >
                  <TemplateRenderer
                    componentSlug={template.componentSlug}
                    greeting={previewGreeting}
                    isEditing
                    onFieldChange={handleFieldChange}
                    onLogoClick={handleLogoClick}
                  />
                </GreetingPageWrapper>
              </div>
            </motion.div>
          )}

          {/* Sidebar */}
          <motion.div
            variants={anim.fadeInUp}
            className="lg:w-[340px] shrink-0 glass-card p-5 rounded-xl space-y-5 h-fit"
          >
            <h2 className="font-bold text-base">Settings</h2>

            {/* Greeting Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Greeting name</label>
              <p className="text-[11px] text-gray-400 mb-1.5">
                Helps you find this greeting in your dashboard
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g., ${template.name} Card`}
                className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm"
              />
            </div>

            {/* Card Content */}
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
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Your company or team name"
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Greeting message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              {logoUrl ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={logoUrl}
                    alt="Logo"
                    width={48}
                    height={48}
                    unoptimized
                    className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <Button variant="destructive" size="sm" type="button" onClick={handleRemoveLogo} icon={<Trash2 size={14} />}>
                    Remove
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed rounded-lg text-xs transition cursor-pointer border-gray-300 dark:border-gray-600 text-gray-500 hover:border-primary hover:text-primary"
                  onClick={handleLogoClick}
                >
                  {uploadingLogo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Upload logo
                </button>
              )}
            </div>

            {/* Music */}
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
                          setMusicTrackId(track.id === "none" ? null : track.id);
                          setShowMusicPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                          (musicTrackId || "none") === track.id
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

            {/* Color Theme (ValentineRose only) */}
            {template.componentSlug === "valentine-rose" && (
              <div>
                <label className="text-sm font-medium mb-1">Color theme</label>
                <Select
                  value={layoutVariant}
                  onChange={setLayoutVariant}
                  options={[
                    { value: "red", label: "Classic Red" },
                    { value: "pink", label: "Soft Pink" },
                    { value: "maroon", label: "Deep Maroon" },
                  ]}
                />
              </div>
            )}

            {/* Toggles */}
            <ToggleSwitch
              checked={submissionsEnabled}
              onChange={setSubmissionsEnabled}
              label="Enable Public Submissions"
            />

            {/* Save Action */}
            <div className="pt-3">
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 btn-theme text-white"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Save size={18} />
                    Save Greeting
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </UnsavedChangesGuard>
  );
}
