"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "btn-theme text-white font-bold shadow-theme active:scale-[0.98] transition-all",
  secondary:
    "border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent " +
    "text-gray-700 dark:text-gray-300 font-medium " +
    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
  ghost:
    "text-gray-500 dark:text-gray-400 font-medium " +
    "hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
  icon:
    "text-gray-500 dark:text-gray-400 " +
    "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
  destructive:
    "text-red-500 font-medium " +
    "hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
};

const sizeClasses: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: {
    sm: "px-4 py-2 text-sm rounded-lg gap-2",
    md: "px-6 py-2.5 text-sm rounded-xl gap-2",
    lg: "py-3.5 text-base rounded-xl gap-2",
  },
  secondary: {
    sm: "px-4 py-2 text-sm rounded-lg gap-2",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-5 py-3 text-sm rounded-xl gap-2",
  },
  ghost: {
    sm: "px-2 py-1 text-xs rounded-md gap-1.5",
    md: "px-3 py-1.5 text-sm rounded-lg gap-2",
    lg: "px-4 py-2 text-sm rounded-lg gap-2",
  },
  icon: {
    sm: "p-1 rounded-full",
    md: "p-1.5 rounded-lg",
    lg: "p-2 rounded-lg",
  },
  destructive: {
    sm: "px-2 py-1 text-xs rounded-md gap-1.5",
    md: "px-3 py-1.5 text-sm rounded-lg gap-2",
    lg: "px-4 py-2 text-sm rounded-lg gap-2",
  },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      iconRight,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[variant][size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={variant === "icon" ? 18 : 20} />
        ) : (
          <>
            {icon}
            {children}
            {iconRight}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
