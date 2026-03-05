"use client";

import { Shield, Trophy, BarChart3, Users } from "lucide-react";

export type Faction = "alliance" | "horde";

const features = [
  {
    icon: <Shield className="size-6" />,
    title: "Facções",
    description:
      "Escolha seu lado — Horda ou Aliança — e represente sua facção no ranking global.",
    color: "text-red-400",
  },
  {
    icon: <Trophy className="size-6" />,
    title: "Ranking Global",
    description:
      "Compete com jogadores do mundo todo. Suas conquistas diárias somam pontos no placar.",
    color: "text-amber-400",
  },
  {
    icon: <BarChart3 className="size-6" />,
    title: "Estatísticas",
    description:
      "Acompanhe seu histórico, sequência de acertos e desempenho por categoria.",
    color: "text-sky-400",
  },
  {
    icon: <Users className="size-6" />,
    title: "Perfil & Comunidade",
    description:
      "Personalize seu perfil com avatar e facção. Veja como seus amigos estão jogando.",
    color: "text-emerald-400",
  },
];

type FeaturesSectionProps = {
  selectedFaction: Faction;
  onSelectFaction: (faction: Faction) => void;
};

export function FeaturesSection({ selectedFaction, onSelectFaction }: FeaturesSectionProps) {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-[hsl(220,20%,6%)]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-(family-name:--font-cinzel) text-gold/60 text-sm uppercase tracking-[0.3em] mb-4">
            Recursos
          </p>
          <h2 className="font-(family-name:--font-cinzel) font-bold text-3xl sm:text-4xl text-amber-100/90 mb-4">
            Mais que um Jogo
          </h2>
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="w-16 h-px bg-linear-to-r from-transparent to-gold/30" />
            <span className="text-gold/40 text-xs">◆ ◆ ◆</span>
            <div className="w-16 h-px bg-linear-to-l from-transparent to-gold/30" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex gap-5 p-6 rounded-lg border border-gold/10 bg-white/2 hover:border-gold/25 hover:bg-white/4 transition-all duration-300"
            >
              <div className="shrink-0">
                <div
                  className={`w-12 h-12 rounded-lg bg-gold/5 border border-gold/15 flex items-center justify-center ${feature.color} group-hover:bg-gold/10 transition-colors duration-300`}
                >
                  {feature.icon}
                </div>
              </div>
              <div>
                <h3 className="font-(family-name:--font-cinzel) text-amber-100/85 text-base font-semibold mb-1.5">
                  {feature.title}
                </h3>
                <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center text-center">
          <p className="font-(family-name:--font-cinzel) text-amber-100/50 text-sm mb-6 uppercase tracking-wider">
            Escolha seu lado
          </p>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => onSelectFaction("alliance")}
              className="group cursor-pointer flex flex-col items-center gap-3"
            >
              <div
                className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedFaction === "alliance"
                    ? "border-alliance/80 bg-alliance/15 shadow-[0_0_35px_rgba(0,112,221,0.24)]"
                    : "border-alliance/30 bg-alliance/5 group-hover:border-alliance/60 group-hover:bg-alliance/10 group-hover:shadow-[0_0_30px_rgba(0,112,221,0.15)]"
                }`}
              >
                <span className="text-3xl">🦁</span>
              </div>
              <span
                className={`font-(family-name:--font-cinzel) text-xs font-semibold tracking-wider uppercase ${
                  selectedFaction === "alliance" ? "text-alliance" : "text-alliance/80"
                }`}
              >
                Aliança
              </span>
            </button>
            <div className="flex items-center">
              <span className="font-(family-name:--font-cinzel) text-gold/30 text-2xl font-bold">
                VS
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectFaction("horde")}
              className="group cursor-pointer flex flex-col items-center gap-3"
            >
              <div
                className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedFaction === "horde"
                    ? "border-horde/80 bg-horde/15 shadow-[0_0_35px_rgba(196,30,58,0.24)]"
                    : "border-horde/30 bg-horde/5 group-hover:border-horde/60 group-hover:bg-horde/10 group-hover:shadow-[0_0_30px_rgba(196,30,58,0.15)]"
                }`}
              >
                <span className="text-3xl">🐺</span>
              </div>
              <span
                className={`font-(family-name:--font-cinzel) text-xs font-semibold tracking-wider uppercase ${
                  selectedFaction === "horde" ? "text-horde" : "text-horde/80"
                }`}
              >
                Horda
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
