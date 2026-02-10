"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function Collapsible({
  title,
  icon,
  description,
  defaultOpen = false,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium w-full text-left"
      >
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={14} />
        </motion.span>
        {icon && <span className="shrink-0">{icon}</span>}
        {title}
      </button>
      {description && (
        <p className="text-[11px] text-gray-400 mt-0.5 mb-1 ml-[30px]">
          {description}
        </p>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 pl-[30px]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
