"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Trash2,
  ImagePlus,
} from "lucide-react";
import * as anim from "@/lib/animations";
import PageLoader from "@/components/PageLoader";
import ToggleSwitch from "@/components/ToggleSwitch";
import toast from "react-hot-toast";

interface QrisEntry {
  label: string;
  url: string;
}

export default function PaymentSettingsPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "platform">("manual");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Manual config state
  const [manualConfig, setManualConfig] = useState({
    displayName: "",
    instructions: "",
    ewalletType: "",
    ewalletNumber: "",
    active: false,
  });
  const [qrisImages, setQrisImages] = useState<QrisEntry[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [uploading, setUploading] = useState(false);

  // Platform config state
  const [platformConfig, setPlatformConfig] = useState({
    displayName: "",
    active: false,
  });

  // Load existing configs on mount
  useEffect(() => {
    fetch("/api/receiver-configs")
      .then((res) => res.json())
      .then((configs: Array<Record<string, string | null>>) => {
        const manual = configs.find((c) => c.mode === "manual");
        const platform = configs.find((c) => c.mode === "platform");

        if (manual) {
          setManualConfig({
            displayName: manual.displayName || "",
            instructions: manual.instructionsText || "",
            ewalletType: manual.ewalletType || "",
            ewalletNumber: manual.ewalletNumber || "",
            active: manual.status === "active",
          });
          // Parse QRIS images — handle both JSON array and legacy single URL
          try {
            const parsed = JSON.parse(manual.qrisImageUrl || "[]");
            setQrisImages(Array.isArray(parsed) ? parsed : []);
          } catch {
            if (manual.qrisImageUrl) {
              setQrisImages([{ label: "QRIS", url: manual.qrisImageUrl }]);
            }
          }
        }

        if (platform) {
          setPlatformConfig({
            displayName: platform.displayName || "",
            active: platform.status === "active",
          });
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Upload a QRIS image
  const handleQrisUpload = async (file: File) => {
    if (!newLabel.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg || "Upload failed");
        setUploading(false);
        return;
      }
      const { url } = await res.json();
      setQrisImages((prev) => [...prev, { label: newLabel.trim(), url }]);
      setNewLabel("");
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Remove a QRIS entry
  const handleQrisRemove = async (index: number) => {
    const entry = qrisImages[index];
    // Delete file from server (best-effort)
    fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: entry.url }),
    }).catch(() => {});
    setQrisImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save config for the active tab
  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      if (activeTab === "manual") {
        await fetch("/api/receiver-configs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "manual",
            status: manualConfig.active ? "active" : "inactive",
            displayName: manualConfig.displayName,
            qrisImageUrl: JSON.stringify(qrisImages),
            instructionsText: manualConfig.instructions,
            ewalletType: manualConfig.ewalletType,
            ewalletNumber: manualConfig.ewalletNumber,
          }),
        });
      } else {
        await fetch("/api/receiver-configs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "platform",
            status: platformConfig.active ? "active" : "inactive",
            displayName: platformConfig.displayName,
            noticeText:
              "Donations are processed by our system. Payout to your company will be available in Phase 2.",
          }),
        });
      }
      setSaved(true);
      toast.success("Settings saved!");
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div
      className="max-w-4xl space-y-6"
      initial="hidden"
      animate="visible"
      variants={anim.staggerContainer}
    >
      <motion.div variants={anim.fadeInDown}>
        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-gray-500 mt-1">
          Configure how you receive donations.
        </p>
      </motion.div>

      <motion.div
        variants={anim.scaleIn}
        className="glass-card rounded-xl overflow-hidden"
      >
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 relative">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 py-4 text-center font-medium transition-colors relative z-10 ${
              activeTab === "manual"
                ? "text-theme-primary"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Manual Transfer (QR)
          </button>
          <button
            onClick={() => setActiveTab("platform")}
            className={`flex-1 py-4 text-center font-medium transition-colors relative z-10 ${
              activeTab === "platform"
                ? "text-theme-primary"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Platform (Xendit)
          </button>
          <motion.div
            className="absolute bottom-0 h-0.5 tab-indicator-theme"
            animate={{
              left: activeTab === "manual" ? "0%" : "50%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Tab content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "manual" ? (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-semibold">
                  Manual Payment Configuration
                </h3>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Display Name
                  </label>
                  <input
                    value={manualConfig.displayName}
                    onChange={(e) =>
                      setManualConfig({
                        ...manualConfig,
                        displayName: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
                    placeholder="e.g. Finance Dept"
                  />
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Instructions
                  </label>
                  <textarea
                    value={manualConfig.instructions}
                    onChange={(e) =>
                      setManualConfig({
                        ...manualConfig,
                        instructions: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 h-24 input-focus-theme outline-none transition resize-none"
                    placeholder="Please transfer to..."
                  />
                </div>

                {/* E-Wallet fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      E-Wallet Type
                    </label>
                    <input
                      value={manualConfig.ewalletType}
                      onChange={(e) =>
                        setManualConfig({
                          ...manualConfig,
                          ewalletType: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
                      placeholder="e.g. GoPay, OVO, Dana"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      E-Wallet Number
                    </label>
                    <input
                      value={manualConfig.ewalletNumber}
                      onChange={(e) =>
                        setManualConfig({
                          ...manualConfig,
                          ewalletNumber: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
                      placeholder="e.g. 081234567890"
                    />
                  </div>
                </div>

                {/* QRIS Images Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">
                    QRIS Images
                  </label>

                  {/* Existing QRIS entries */}
                  <AnimatePresence>
                    {qrisImages.map((entry, index) => (
                      <motion.div
                        key={entry.url}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 p-3 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      >
                        <Image
                          src={entry.url}
                          alt={entry.label}
                          width={56}
                          height={56}
                          unoptimized
                          className="w-14 h-14 object-cover rounded-lg border dark:border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {entry.label}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {entry.url}
                          </p>
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQrisRemove(index)}
                          className="p-2 text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition shrink-0"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add new QRIS */}
                  <div className="flex gap-2">
                    <input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Label (e.g. BCA QR, GoPay, Dana)"
                      className="flex-1 p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm"
                    />
                  </div>

                  <motion.label
                    whileHover={!uploading && newLabel.trim() ? {} : {}}
                    className={`border-2 border-dashed rounded-xl p-6 text-center block transition-colors ${
                      !newLabel.trim() || uploading
                        ? "border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed"
                        : "border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      disabled={uploading || !newLabel.trim()}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleQrisUpload(file);
                        e.target.value = "";
                      }}
                    />
                    {uploading ? (
                      <Loader2
                        className="mx-auto animate-spin loader-theme"
                        size={28}
                      />
                    ) : (
                      <>
                        <ImagePlus
                          size={28}
                          className="mx-auto text-gray-400 mb-2"
                        />
                        <p className="text-gray-500 text-sm font-medium">
                          {newLabel.trim()
                            ? `Upload QRIS for "${newLabel.trim()}"`
                            : "Enter a label above first"}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          PNG, JPG, WebP up to 2MB
                        </p>
                      </>
                    )}
                  </motion.label>
                </div>

                {/* Activate toggle */}
                <ToggleSwitch
                  checked={manualConfig.active}
                  onChange={(checked) =>
                    setManualConfig({ ...manualConfig, active: checked })
                  }
                  label="Activate Manual Payments"
                />
              </motion.div>
            ) : (
              <motion.div
                key="platform"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <h3 className="text-lg font-semibold">
                  Platform Payment Configuration
                </h3>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 flex gap-3 rounded-r-lg">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">
                    <strong>Important:</strong> Platform donations are processed
                    by our system. Payout to your company will be available in
                    Phase 2. For now, donations are held by the platform.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Display Name
                  </label>
                  <input
                    value={platformConfig.displayName}
                    onChange={(e) =>
                      setPlatformConfig({
                        ...platformConfig,
                        displayName: e.target.value,
                      })
                    }
                    className="w-full p-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition"
                    placeholder="e.g. My Company"
                  />
                </div>
                <ToggleSwitch
                  checked={platformConfig.active}
                  onChange={(checked) =>
                    setPlatformConfig({ ...platformConfig, active: checked })
                  }
                  label="Activate Platform Payments"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Save button */}
          <motion.div
            className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handleSave}
              disabled={saving || uploading}
              whileHover={{ scale: saving || uploading ? 1 : 1.02 }}
              whileTap={{ scale: saving || uploading ? 1 : 0.98 }}
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
                  <Save size={18} /> Save Settings
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
