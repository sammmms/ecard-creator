"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Sparkles,
  X,
  CreditCard,
  FileImage,
  CheckCircle,
  Eye,
  Gift,
  Lock,
} from "lucide-react";
import * as anim from "@/lib/animations";
import PageLoader from "@/components/PageLoader";

interface Template {
  id: string;
  name: string;
  price: number;
  isTrial: boolean;
  previewImageUrl: string;
  configJson: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [hasTrialGreeting, setHasTrialGreeting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/templates").then((res) => res.json()),
      fetch("/api/greetings").then((res) => res.json()),
    ])
      .then(([templateData, greetingsData]) => {
        setTemplates(templateData);
        // Check if user already has a trial greeting
        const hasTrial = Array.isArray(greetingsData) && greetingsData.some((g: any) => g.isTrial);
        setHasTrialGreeting(hasTrial);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleConfirmPurchase = async () => {
    if (!selectedTemplate) return;
    setCreating(true);
    try {
      const res = await fetch("/api/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedTemplate.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.error) {
          alert(data.error);
        }
        setCreating(false);
        return;
      }

      const greeting = await res.json();

      // Trial: skip payment, go directly to editor
      if (selectedTemplate.isTrial) {
        router.push(`/app/greetings/${greeting.id}/edit`);
      } else {
        router.push(`/app/greetings/${greeting.id}/pay`);
      }
    } catch (error) {
      console.error(error);
      setCreating(false);
    }
  };

  const handleTryTemplate = (template: Template) => {
    if (template.isTrial) {
      if (hasTrialGreeting) {
        alert("You already have a trial greeting. Upgrade to a paid template for full features!");
        return;
      }
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(template);
    }
  };

  if (loading) return <PageLoader />;

  // Separate trial and paid templates
  const trialTemplates = templates.filter((t) => t.isTrial);
  const paidTemplates = templates.filter((t) => !t.isTrial);

  return (
    <>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={anim.staggerContainer}
      >
        <motion.div
          className="flex justify-between items-center"
          variants={anim.fadeInDown}
        >
          <div>
            <h1 className="text-3xl font-bold">Choose a Template</h1>
            <p className="text-gray-500 mt-1">
              Select a design to create your greeting card.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles size={16} className="text-amber-500" />
            {templates.length} templates available
          </div>
        </motion.div>

        {templates.length === 0 && !loading && (
          <motion.div
            variants={anim.fadeInUp}
            className="text-center py-16 glass-card rounded-xl"
          >
            <Sparkles size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No templates available yet.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Templates will appear here once they are seeded.
            </p>
          </motion.div>
        )}

        {/* Trial Templates Section */}
        {trialTemplates.length > 0 && (
          <motion.div variants={anim.fadeInUp} className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift size={20} className="text-green-500" />
              <h2 className="text-xl font-bold">Free Trial</h2>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-0.5 rounded-full font-medium">
                Try for free
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trialTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={anim.staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow group relative"
                >
                  {/* Free badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      FREE
                    </span>
                  </div>

                  <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                    {template.previewImageUrl ? (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${template.previewImageUrl})`,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
                        <Sparkles size={32} className="text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <motion.button
                        onClick={() => setPreviewTemplate(template)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
                      >
                        <Eye size={14} /> Preview
                      </motion.button>
                      <motion.button
                        onClick={() => handleTryTemplate(template)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={hasTrialGreeting}
                        className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {hasTrialGreeting ? "Trial Used" : "Try Now"}
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{template.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        Free
                      </span>
                      {hasTrialGreeting && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Lock size={10} /> Already used
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Paid Templates Section */}
        {paidTemplates.length > 0 && (
          <motion.div variants={anim.fadeInUp} className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h2 className="text-xl font-bold">Premium Templates</h2>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={anim.staggerContainer}
            >
              {paidTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={anim.staggerItem}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                    {template.previewImageUrl ? (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{
                          backgroundImage: `url(${template.previewImageUrl})`,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Sparkles size={32} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <motion.button
                        onClick={() => setPreviewTemplate(template)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
                      >
                        <Eye size={14} /> Preview
                      </motion.button>
                      <motion.button
                        onClick={() => setSelectedTemplate(template)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                      >
                        Use Template
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{template.name}</h3>
                    <p className="text-gray-500 mt-1">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(template.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewTemplate(null)}
                className="absolute top-4 right-4 z-10 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Preview area - simulates the greeting layout */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-red-800 via-red-600 to-red-900 overflow-hidden flex items-center justify-center">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-6 text-4xl animate-pulse">🏮</div>
                  <div className="absolute top-8 right-8 text-3xl animate-pulse" style={{ animationDelay: "1s" }}>🏮</div>
                  <div className="absolute bottom-12 left-12 text-2xl">🌸</div>
                  <div className="absolute bottom-8 right-10 text-2xl">🌸</div>
                </div>

                {/* Preview card */}
                <div className="relative z-10 w-[70%] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl p-6 text-center shadow-2xl">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-3">
                    {previewTemplate.isTrial
                      ? "Powered by E-Card Greeting"
                      : "[Your Company Logo]"}
                  </div>
                  <h3 className="text-2xl font-bold text-theme-gradient mb-2">
                    [Your Greeting Title]
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    [Your greeting message will appear here. Write something warm and heartfelt for the recipients!]
                  </p>
                  <div className="text-sm">
                    <span className="text-primary/60 text-xs">With Love,</span>
                    <br />
                    <span className="font-bold text-theme-primary">[Company Name]</span>
                  </div>
                </div>

                {/* Template name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h4 className="text-white font-bold text-lg">
                    {previewTemplate.name}
                  </h4>
                  {previewTemplate.isTrial ? (
                    <span className="text-green-400 text-sm font-medium">Free Trial</span>
                  ) : (
                    <span className="text-white/70 text-sm">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(previewTemplate.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <motion.button
                  onClick={() => {
                    setPreviewTemplate(null);
                    if (previewTemplate.isTrial) {
                      handleTryTemplate(previewTemplate);
                    } else {
                      setSelectedTemplate(previewTemplate);
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-[2] py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-colors ${
                    previewTemplate.isTrial
                      ? "bg-green-500 hover:bg-green-600"
                      : "btn-theme"
                  }`}
                >
                  {previewTemplate.isTrial ? (
                    hasTrialGreeting ? (
                      <>
                        <Lock size={16} /> Trial Already Used
                      </>
                    ) : (
                      <>
                        <Gift size={16} /> Try Now — Free
                      </>
                    )
                  ) : (
                    <>
                      <CreditCard size={16} /> Use Template
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment / Trial Confirmation Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !creating && setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => !creating && setSelectedTemplate(null)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Template preview header */}
              <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-800 relative">
                {selectedTemplate.previewImageUrl ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${selectedTemplate.previewImageUrl})`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
                    <Sparkles size={48} className="text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">
                    {selectedTemplate.name}
                  </h3>
                  {selectedTemplate.isTrial && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FileImage size={14} /> Template
                    </span>
                    <span className="font-medium">
                      {selectedTemplate.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <CheckCircle size={14} /> Includes
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      1 greeting generation
                    </span>
                  </div>
                  {selectedTemplate.isTrial && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Lock size={14} /> Restrictions
                      </span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        Limited features
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold text-theme-primary">
                      {selectedTemplate.isTrial ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(selectedTemplate.price)
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                  {selectedTemplate.isTrial ? (
                    <>
                      <p>
                        Your trial greeting will be published immediately with limited features.
                        Custom logo, donations, and full sharing are locked.
                      </p>
                      <p>
                        Upgrade anytime by choosing a paid template for the full experience.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        By proceeding you will create a new greeting card from this
                        template. You will be redirected to complete payment.
                      </p>
                      <p>
                        Once paid, your greeting will be published with a permanent
                        shareable link.
                      </p>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    disabled={creating}
                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleConfirmPurchase}
                    disabled={creating}
                    whileHover={{ scale: creating ? 1 : 1.02 }}
                    whileTap={{ scale: creating ? 1 : 0.98 }}
                    className={`flex-[2] py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-colors ${
                      selectedTemplate.isTrial
                        ? "bg-green-500 hover:bg-green-600"
                        : "btn-theme"
                    }`}
                  >
                    {creating ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : selectedTemplate.isTrial ? (
                      <>
                        <Gift size={16} /> Generate Free Trial
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} /> Continue to Payment
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
