"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  icon,
  onClick,
}: ToggleSwitchProps) {
  return (
    <label
      className={`flex items-center gap-3 ${disabled ? "cursor-pointer" : "cursor-pointer"} group`}
      onClick={onClick}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-10 h-5 rounded-full transition-colors ${
            disabled
              ? "bg-gray-200 dark:bg-gray-700 opacity-50"
              : "bg-gray-200 dark:bg-gray-700 toggle-bg-theme"
          }`}
        />
        <div
          className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            disabled ? "" : "peer-checked:translate-x-5"
          }`}
        />
      </div>
      <span className="text-sm font-medium flex items-center gap-2">
        {label}
        {icon}
      </span>
    </label>
  );
}
