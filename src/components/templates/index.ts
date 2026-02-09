import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { TemplateProps } from "@/types/template";

const templateMap: Record<string, ComponentType<TemplateProps>> = {
  "gold-n-shiny": dynamic(() => import("./GoldNShiny")),
  "crimson-bloom": dynamic(() => import("./CrimsonBloom")),
  "jade-prosperity": dynamic(() => import("./JadeProsperity")),
};

export function getTemplateComponent(
  slug: string | null | undefined,
): ComponentType<TemplateProps> | null {
  if (!slug) return null;
  return templateMap[slug] || null;
}
