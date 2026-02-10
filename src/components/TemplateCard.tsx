import { motion } from "framer-motion";
import { Eye, Sparkles, Gift } from "lucide-react";

export interface Template {
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

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUse: (template: Template) => void;
  onTryFree?: (template: Template) => void;
  hasActiveTrial?: boolean;
}

export default function TemplateCard({
  template,
  onPreview,
  onUse,
  onTryFree,
  hasActiveTrial = false,
}: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-xl overflow-hidden hover:shadow-xl transition-shadow group relative flex flex-col h-full"
    >
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
            <Sparkles size={32} className="text-gray-400" />
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
            className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
          >
            Use Template
          </motion.button>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-bold">{template.name}</h3>

        {/* Description */}
        {template.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
            {template.description}
          </p>
        )}

        <div className="mt-1 mb-4 grow">
          <p className="text-gray-500">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(template.price)}
          </p>
        </div>

        {/* Mobile Actions Footer */}
        <div className="flex md:hidden items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-2 px-3 rounded-lg bg-gray-100 dark:bg-white/10 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye size={14} /> Preview
          </button>
          {onTryFree && (
            <button
              onClick={() => onTryFree(template)}
              disabled={hasActiveTrial}
              className="flex-1 py-2 px-3 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Gift size={12} />
              {hasActiveTrial ? "Trial Active" : "Try Free"}
            </button>
          )}
          <button
            onClick={() => onUse(template)}
            className="flex-1 py-2 px-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Use Template
          </button>
        </div>

        {/* Desktop Try Free button (always visible below card info) */}
        {onTryFree && (
          <div className="hidden md:block pt-3 border-t border-gray-100 dark:border-white/10 mt-auto">
            <button
              onClick={() => onTryFree(template)}
              disabled={hasActiveTrial}
              className="w-full py-2 px-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Gift size={12} />
              {hasActiveTrial ? "Trial Active" : "Try Free"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
