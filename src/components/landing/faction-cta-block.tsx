"use client";

import { useState } from "react";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection, type Faction } from "@/components/landing/features-section";

export function FactionCtaBlock() {
  const [selectedFaction, setSelectedFaction] = useState<Faction>("alliance");

  return (
    <>
      <FeaturesSection
        selectedFaction={selectedFaction}
        onSelectFaction={setSelectedFaction}
      />
      <CTASection selectedFaction={selectedFaction} />
    </>
  );
}