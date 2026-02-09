"use client";

import type { TemplateProps } from "@/types/template";
import GoldNShiny from "./GoldNShiny";
import CrimsonBloom from "./CrimsonBloom";
import JadeProsperity from "./JadeProsperity";

export default function TemplateRenderer({
  componentSlug,
  ...props
}: TemplateProps & { componentSlug: string }) {
  switch (componentSlug) {
    case "gold-n-shiny":
      return <GoldNShiny {...props} />;
    case "crimson-bloom":
      return <CrimsonBloom {...props} />;
    case "jade-prosperity":
      return <JadeProsperity {...props} />;
    default:
      return null;
  }
}
