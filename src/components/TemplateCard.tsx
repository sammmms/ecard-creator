import { motion } from "framer-motion";
import { Eye, Lock, Sparkles } from "lucide-react";
import * as anim from "@/lib/animations";

export interface Template {
  id: string;
  name: string;
  price: number;
  isTrial: boolean;
  previewImageUrl: string;
  configJson: string;
  componentSlug?: string | null;
}

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
  hasTrialGreeting?: boolean;
}

export default function TemplateCard({
  template,
  onPreview,
  onUse,
  hasTrialGreeting = false,
}: TemplateCardProps) {
  return (
    <motion.div
      variants={anim.staggerItem}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow group relative flex flex-col h-full"
    >
      {/* Free badge for trial templates */}
      {template.isTrial && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            FREE
          </span>
        </div>
      )}

      <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative overflow-hidden shrink-0">
        {template.previewImageUrl ? (
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{
              backgroundImage: `url(${template.previewImageUrl})`,
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20">
            {template.isTrial ? (
              <Sparkles size={32} className="text-primary/40" />
            ) : (
              <Sparkles size={32} className="text-gray-400" />
            )}
          </div>
        )}

        {/* Desktop Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col lg:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={() => onPreview(template)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5"
          >
            <Eye size={14} /> <span>Preview</span>
          </motion.button>
          <motion.button
            onClick={() => onUse(template)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={template.isTrial && hasTrialGreeting}
            className={`px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 disabled:opacity-50 disabled:cursor-not-allowed ${
              template.isTrial
                ? "bg-green-500 text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {template.isTrial
              ? hasTrialGreeting
                ? "Trial Used"
                : "Try Now"
              : "Use Template"}
          </motion.button>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-bold">{template.name}</h3>
        <div className="mt-1 mb-4 grow">
          {template.isTrial ? (
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400 font-bold">
                Free
              </span>
              {hasTrialGreeting && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Lock size={10} /> Already used
                </span>
              )}
            </div>
          ) : (
            <p className="text-gray-500">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(template.price)}
            </p>
          )}
        </div>

        {/* Mobile Actions Footer */}
        <div className="flex md:hidden items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-2 px-3 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => onUse(template)}
            disabled={template.isTrial && hasTrialGreeting}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              template.isTrial
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}
          >
            {template.isTrial
              ? hasTrialGreeting
                ? "Trial Used"
                : "Try Now"
              : "Use Template"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
