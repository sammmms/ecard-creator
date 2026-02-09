"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className = "", rightElement, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-black focus-theme transition-all outline-none ${
              error ? "border-red-500" : ""
            } ${rightElement ? "pr-12" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);
TextField.displayName = "TextField";

interface PasswordFieldProps extends Omit<TextFieldProps, "type"> {
  showReveal?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ showReveal = true, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
      <TextField
        ref={ref}
        type={isVisible ? "text" : "password"}
        rightElement={
          showReveal ? (
            <button
              type="button"
              onClick={toggleVisibility}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  },
);
PasswordField.displayName = "PasswordField";
