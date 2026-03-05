import { Sword, Map, Cat, Zap, Quote } from "lucide-react";
import type { ReactNode } from "react";

interface GameCategory {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  glowColor: string;
}

const categories: GameCategory[] = [
  {
    icon: <Sword className="size-6" />,
    title: "Personagem",
    description:
      "Adivinhe o personagem pelo seus atributos: raça, classe, facção, expansão e mais.",
    color: "text-amber-400",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]",
  },
  {
    icon: <Map className="size-6" />,
    title: "Zona",
    description:
      "Identifique a zona de World of Warcraft a partir de pistas visuais e dicas.",
    color: "text-emerald-400",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]",
  },
  {
    icon: <Cat className="size-6" />,
    title: "Montaria",
    description:
      "Reconheça a montaria pela silhueta, cores e origem. Quantas você conhece?",
    color: "text-sky-400",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Habilidade",
    description:
      "Descubra qual é a habilidade pelo ícone, descrição ou efeito. Teste seu domínio.",
    color: "text-purple-400",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(192,132,252,0.1)]",
  },
  {
    icon: <Quote className="size-6" />,
    title: "Citação",
    description:
      "Quem disse isso? Identifique o personagem pela frase icônica de Azeroth.",
    color: "text-orange-400",
    glowColor: "group-hover:shadow-[0_0_20px_rgba(251,146,60,0.1)]",
  },
];

function CategoryCard({ category }: { category: GameCategory }) {
  return (
    <div
      className={`group relative flex flex-col gap-4 p-6 rounded-lg border border-gold/10 bg-white/2 hover:border-gold/25 hover:bg-white/4 transition-all duration-300 cursor-pointer ${category.glowColor}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg bg-gold/5 border border-gold/15 flex items-center justify-center ${category.color} group-hover:bg-gold/10 transition-colors duration-300`}
        >
          {category.icon}
        </div>
        <h3 className={`font-(family-name:--font-cinzel) text-base font-semibold ${category.color}`}>
          {category.title}
        </h3>
      </div>

      <p className="font-(family-name:--font-crimson) text-amber-100/45 text-sm leading-relaxed">
        {category.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-amber-100/25 font-(family-name:--font-cinzel) uppercase tracking-wider mt-auto">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
        Desafio ativo
      </div>
    </div>
  );
}

export function CategoriesSection() {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-[hsl(220,20%,6%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,168,67,0.04),transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-(family-name:--font-cinzel) text-gold/60 text-sm uppercase tracking-[0.3em] mb-4">
            Modos de Jogo
          </p>
          <h2 className="font-(family-name:--font-cinzel) font-bold text-3xl sm:text-4xl text-amber-100/90 mb-4">
            Cinco Desafios Diários
          </h2>
          <div className="flex items-center gap-4 justify-center my-6">
            <div className="w-16 h-px bg-linear-to-r from-transparent to-gold/30" />
            <span className="text-gold/40 text-xs">◆ ◆ ◆</span>
            <div className="w-16 h-px bg-linear-to-l from-transparent to-gold/30" />
          </div>
          <p className="font-(family-name:--font-crimson) text-amber-100/50 text-lg max-w-xl mx-auto">
            Cada dia traz um novo mistério em cinco categorias diferentes.
            Acerte com o menor número de tentativas para subir no ranking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
