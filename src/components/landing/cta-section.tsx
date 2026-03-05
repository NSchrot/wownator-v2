"use client";

import { Button } from "@/components/ui/warcraftcn/button";
import Link from "next/link";
import type { Faction } from "@/components/landing/features-section";

type CTASectionProps = {
  selectedFaction: Faction;
};

export function CTASection({ selectedFaction }: CTASectionProps) {
  const isHorde = selectedFaction === "horde";

  const getFactionTitle = (faction: Faction) =>
    faction === "horde" ? "Lok'tar Ogar!" : "Pela Aliança!";

  const getFactionTitleColor = (faction: Faction) =>
    faction === "horde"
      ? "bg-linear-to-b from-red-300 via-horde to-red-800"
      : "bg-linear-to-b from-alliance/30 via-alliance to-blue-300";

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-[hsl(220,20%,6%)] via-[hsl(220,22%,9%)] to-[hsl(220,20%,6%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,168,67,0.06),transparent_60%)]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="font-(family-name:--font-cinzel) text-gold/60 text-sm uppercase tracking-[0.3em] mb-6">
          Pronto para o desafio?
        </p>

        <h2 className="font-(family-name:--font-cinzel) font-bold text-4xl sm:text-5xl leading-tight mb-6">
          <span className="relative inline-grid min-h-[1.25em] place-items-center">
            <span
              className={`col-start-1 row-start-1 bg-clip-text text-transparent transition-all duration-350 ease-out ${getFactionTitleColor(
                "alliance"
              )} ${
                selectedFaction === "alliance"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-4"
              }`}
            >
              {getFactionTitle("alliance")}
            </span>
            <span
              className={`col-start-1 row-start-1 bg-clip-text text-transparent transition-all duration-350 ease-out ${getFactionTitleColor(
                "horde"
              )} ${
                selectedFaction === "horde"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {getFactionTitle("horde")}
            </span>
          </span>
        </h2>

        <p className="font-(family-name:--font-crimson) text-amber-100/50 text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Entre na arena e prove que você é o maior conhecedor de Azeroth.
          O desafio de hoje já está esperando por você.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/play">
            <Button
              variant="default"
              className={`text-lg px-12 py-6 uppercase tracking-widest bg-[linear-gradient(180deg,#0f4f93_0%,#1b73cc_52%,#0b3c75_100%)] transition-[filter] duration-500 ${
                isHorde
                  ? "filter-[hue-rotate(130deg)_saturate(1.9)_brightness(0.90)] hover:filter-[hue-rotate(130deg)_saturate(2)_brightness(1)]"
                  : "filter-none hover:brightness-110"
              }`}
            >
              Começar a Jogar
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-gold/20">
          <span className="text-sm">—</span>
          <span className="text-xs font-(family-name:--font-cinzel) tracking-[0.2em] uppercase">
            For Azeroth
          </span>
          <span className="text-sm">—</span>
        </div>
      </div>
    </section>
  );
}
