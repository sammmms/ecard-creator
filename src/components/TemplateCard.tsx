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
      className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow group relative"
    >
      {/* Free badge for trial templates */}
      {template.isTrial && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            FREE
          </span>
        </div>
      )}

      <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
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

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
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

      <div className="p-4">
        <h3 className="text-lg font-bold">{template.name}</h3>
        <div className="mt-1">
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
      </div>
    </motion.div>
  );
}
