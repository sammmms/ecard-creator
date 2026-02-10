"use client";

import type { TemplateProps } from "@/types/template";
import GoldNShiny from "./GoldNShiny";
import CrimsonBloom from "./CrimsonBloom";
import JadeProsperity from "./JadeProsperity";
import ValentineRose from "./ValentineRose";
import ValentineSweet from "./ValentineSweet";
import ValentineBloom from "./ValentineBloom";

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
    case "valentine-rose":
      return <ValentineRose {...props} />;
    case "valentine-sweet":
      return <ValentineSweet {...props} />;
    case "valentine-bloom":
      return <ValentineBloom {...props} />;
    default:
      return null;
  }
}
