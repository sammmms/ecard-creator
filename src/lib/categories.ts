export const CATEGORIES = [
  { value: "all", label: "All Templates" },
  { value: "cny", label: "Chinese New Year" },
  { value: "valentine", label: "Valentine's Day" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
