"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  Loader2,
  Sparkles,
  X,
  CreditCard,
  FileImage,
  CheckCircle,
  Search,
  SlidersHorizontal,
  Gift,
} from "lucide-react";
import * as anim from "@/lib/animations";
import PageLoader from "@/components/PageLoader";
import Shimmer, { TemplateCardSkeleton } from "@/components/Shimmer";
import Button from "@/components/Button";
import Select from "@/components/Select";
import toast from "react-hot-toast";
import TemplateCard from "@/components/TemplateCard";
import { TemplateRenderer } from "@/components/templates";
import GreetingRenderer from "@/components/GreetingRenderer";
import { CATEGORIES } from "@/lib/categories";
import { fetcher } from "@/lib/fetcher";

interface Template {
  id: string;
  name: string;
  price: number;
  previewImageUrl: string;
  configJson: string;
  componentSlug?: string | null;
  description?: string | null;
  category?: string | null;
  premiumPrice?: number | null;
}

interface GreetingRecord {
  isTrial: boolean;
  templateId: string;
}

// Placeholder greeting data for live template preview
const PREVIEW_GREETING = {
  id: "preview",
  title: "[Your Greeting Title]",
  senderNameDefault: "[Company Name]",
  messageDefault:
    "[Your greeting message will appear here.\nWrite something warm and heartfelt!]",
  companyLogoUrl: undefined,
  isTrial: false,
  submissionsEnabled: false,
  donationEnabled: false,
  donationMode: "none",
  slug: "preview",
  layoutVariant: undefined as string | undefined,
};

const PRICING_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "paid", label: "Paid" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Name A-Z" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

function buildTemplateKey(filters: {
  category: string;
  search: string;
  pricing: string;
  sort: string;
}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all")
    params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.pricing && filters.pricing !== "all")
    params.set("pricing", filters.pricing);
  if (filters.sort && filters.sort !== "name") params.set("sort", filters.sort);
  const qs = params.toString();
  return `/api/templates${qs ? `?${qs}` : ""}`;
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TemplatesPageContent />
    </Suspense>
  );
}

function TemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL params
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [pricing, setPricing] = useState(searchParams.get("pricing") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "name");
  const [creating, setCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Escape key: close topmost overlay (preview > payment modal > filter drawer)
  const handleEscape = useCallback(() => {
    if (previewTemplate) {
      setPreviewTemplate(null);
    } else if (selectedTemplate) {
      setSelectedTemplate(null);
    } else if (filtersOpen) {
      setFiltersOpen(false);
    }
  }, [previewTemplate, selectedTemplate, filtersOpen]);
  useEscapeKey(handleEscape, !!(previewTemplate || selectedTemplate || filtersOpen));

  // SWR: templates (server-filtered)
  const templateKey = buildTemplateKey({
    category: selectedCategory,
    search: searchQuery,
    pricing,
    sort,
  });
  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
  } = useSWR<Template[]>(templateKey, fetcher, {
    keepPreviousData: true,
    dedupingInterval: 2000,
    revalidateOnFocus: false,
  });

  // SWR: greetings (to check which templates have active trials)
  const { data: greetingsData } = useSWR("/api/greetings", fetcher, {
    dedupingInterval: 5000,
    revalidateOnFocus: false,
  });

  // Build a set of template IDs that have active trial greetings
  const trialTemplateIds = new Set<string>();
  if (Array.isArray(greetingsData)) {
    greetingsData.forEach((g: GreetingRecord) => {
      if (g.isTrial) trialTemplateIds.add(g.templateId);
    });
  }

  const loading = templatesLoading && templates.length === 0;

  // Update URL params when filters change
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      const state = {
        category: selectedCategory,
        search: searchQuery,
        pricing,
        sort,
        ...updates,
      };
      if (state.category && state.category !== "all")
        params.set("category", state.category);
      if (state.search) params.set("search", state.search);
      if (state.pricing && state.pricing !== "all")
        params.set("pricing", state.pricing);
      if (state.sort && state.sort !== "name") params.set("sort", state.sort);
      const qs = params.toString();
      router.replace(`/app/templates${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, selectedCategory, searchQuery, pricing, sort],
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateParams({ category: cat });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateParams({ search: value });
  };

  const handlePricingChange = (value: string) => {
    setPricing(value);
    updateParams({ pricing: value });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    updateParams({ sort: value });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPricing("all");
    setSort("name");
    router.replace("/app/templates", { scroll: false });
  };

  const hasActiveFilters =
    selectedCategory !== "all" || pricing !== "all" || sort !== "name";

  // Purchase flow: create paid greeting
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
          toast.error(data.error);
        }
        setCreating(false);
        return;
      }

      const greeting = await res.json();
      router.push(`/app/greetings/${greeting.id}/pay`);
    } catch (error) {
      console.error(error);
      setCreating(false);
    }
  };

  // Try Free flow: create trial greeting
  const handleTryFree = async (template: Template) => {
    if (trialTemplateIds.has(template.id)) {
      toast.error("You already have a trial greeting for this template.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, asTrial: true }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.error) toast.error(data.error);
        setCreating(false);
        return;
      }

      const greeting = await res.json();
      router.push(`/app/greetings/${greeting.id}/edit`);
    } catch (error) {
      console.error(error);
      setCreating(false);
    }
  };

  if (loading)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2">
            <Shimmer className="h-8 w-56" />
            <Shimmer className="h-4 w-72" />
          </div>
          <Shimmer className="h-10 w-10 rounded-lg" />
        </div>
        <Shimmer className="h-10 w-full rounded-lg" />
        <div className="space-y-4">
          <Shimmer className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );

  // Filter sidebar content
  const filterContent = (
    <div className="space-y-5">
      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Category
        </label>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={CATEGORIES.map((c) => ({
            value: c.value,
            label: c.label,
          }))}
        />
      </div>

      {/* Pricing */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Pricing
        </label>
        <div className="flex gap-1.5">
          {PRICING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePricingChange(opt.value)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                pricing === opt.value
                  ? "bg-theme-soft text-theme-primary"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <Select
          value={sort}
          onChange={handleSortChange}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            clearFilters();
            setFiltersOpen(false);
          }}
          className="w-full text-xs font-medium text-theme-primary hover:underline text-center py-2"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={anim.staggerContainer}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between gap-2"
          variants={anim.fadeInDown}
        >
          <div className="min-w-0">
            <h1 className="text-3xl font-bold">Choose a Template</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Select a design to create your greeting card. Every template is
              free to try!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Sparkles size={16} className="text-amber-500" />
              {templates.length} template{templates.length !== 1 ? "s" : ""}
            </div>
            {/* Filter toggle button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className="relative flex items-center gap-1.5 p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={18} />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-theme-primary border-2 border-white dark:border-gray-900" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div variants={anim.fadeInUp}>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border rounded-lg dark:bg-gray-800 dark:border-gray-700 input-focus-theme outline-none transition text-sm"
            />
          </div>
        </motion.div>

        {/* Template grid */}
        <div key={templateKey} className="space-y-8">
          {/* Error state */}
          {templatesError && (
            <div className="text-center py-12 glass-card rounded-xl">
              <p className="text-gray-500 font-medium">
                Failed to load templates.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Please try refreshing the page.
              </p>
            </div>
          )}

          {/* Empty state */}
          {templates.length === 0 && !loading && !templatesError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 glass-card rounded-xl"
            >
              <Search size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No templates match your filters.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try different keywords or clear your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm font-bold text-theme-primary hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}

          {/* All Templates — unified grid */}
          {templates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" />
                <h2 className="text-xl font-bold">Templates</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={setPreviewTemplate}
                    onUse={setSelectedTemplate}
                    onTryFree={handleTryFree}
                    hasActiveTrial={trialTemplateIds.has(template.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filter drawer (slides from right) */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-60 bg-black/40"
              onClick={() => setFiltersOpen(false)}
            />

            {/* Sidebar drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 right-0 z-70 w-72 max-w-[85vw] bg-white dark:bg-gray-950 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-gray-500" />
                  <h3 className="font-bold text-lg">Filters</h3>
                </div>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-5">{filterContent}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Live Template Preview */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100"
          >
            <div className="absolute inset-0 overflow-auto">
              {previewTemplate.componentSlug ? (
                <TemplateRenderer
                  componentSlug={previewTemplate.componentSlug}
                  greeting={PREVIEW_GREETING}
                />
              ) : (
                <GreetingRenderer
                  greeting={{
                    ...PREVIEW_GREETING,
                    template: { configJson: previewTemplate.configJson },
                  }}
                />
              )}
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-4 right-4 z-110 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full transition-colors backdrop-blur-sm"
            >
              <X size={20} />
            </motion.button>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.4,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="absolute bottom-0 left-0 right-0 z-110 bg-linear-to-t from-black/80 via-black/50 to-transparent pt-16 pb-6 px-5"
            >
              <div className="max-w-lg mx-auto flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-lg truncate">
                    {previewTemplate.name}
                  </h4>
                  <span className="text-white/70 text-sm">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(previewTemplate.price)}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <motion.button
                    onClick={() => {
                      const tpl = previewTemplate;
                      setPreviewTemplate(null);
                      handleTryFree(tpl);
                    }}
                    disabled={trialTemplateIds.has(previewTemplate.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-green-500 hover:bg-green-600 flex items-center gap-2 transition-colors shadow-lg disabled:opacity-50"
                  >
                    <Gift size={16} />
                    {trialTemplateIds.has(previewTemplate.id)
                      ? "Trial Active"
                      : "Try Free"}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      const tpl = previewTemplate;
                      setPreviewTemplate(null);
                      setSelectedTemplate(tpl);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-3 rounded-xl font-bold text-sm text-white btn-theme flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <CreditCard size={16} /> Use Template
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
              <button
                onClick={() => !creating && setSelectedTemplate(null)}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="aspect-2/1 bg-gray-200 dark:bg-gray-800 relative">
                {selectedTemplate.previewImageUrl ? (
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${selectedTemplate.previewImageUrl})`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
                    <Sparkles size={48} className="text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">
                    {selectedTemplate.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FileImage size={14} /> Template
                    </span>
                    <span className="font-medium">{selectedTemplate.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2">
                      <CheckCircle size={14} /> Includes
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      1 greeting generation
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-bold text-theme-primary">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(selectedTemplate.price)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                  <p>
                    By proceeding you will create a new greeting card from this
                    template. You will be redirected to complete payment.
                  </p>
                  <p>
                    Once paid, your greeting will be published with a permanent
                    shareable link.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setSelectedTemplate(null)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <motion.button
                    onClick={handleConfirmPurchase}
                    disabled={creating}
                    whileHover={{ scale: creating ? 1 : 1.02 }}
                    whileTap={{ scale: creating ? 1 : 0.98 }}
                    className="flex-2 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-colors btn-theme"
                  >
                    {creating ? (
                      <Loader2 className="animate-spin" size={18} />
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
