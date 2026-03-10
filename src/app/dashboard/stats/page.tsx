import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardSkeleton } from "@/components/dashboard/skeleton-loader";
import { getUserStats } from "@/lib/actions/user-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { Sword, Map, Cat, Zap, Quote } from "lucide-react";

// TODO: Obter userId da sessão autenticada
const DEMO_USER_ID = "demo";

const categoryIcons: Record<string, React.ReactNode> = {
    CHARACTER: <Sword className="size-5" />,
    ZONE: <Map className="size-5" />,
    MOUNT: <Cat className="size-5" />,
    ABILITY: <Zap className="size-5" />,
    QUOTE: <Quote className="size-5" />,
};

const categoryLabels: Record<string, string> = {
    CHARACTER: "Personagem",
    ZONE: "Zona",
    MOUNT: "Montaria",
    ABILITY: "Habilidade",
    QUOTE: "Citação",
};

const categoryColors: Record<string, string> = {
    CHARACTER: "text-amber-400",
    ZONE: "text-emerald-400",
    MOUNT: "text-sky-400",
    ABILITY: "text-purple-400",
    QUOTE: "text-orange-400",
};

async function StatsContent() {
    let stats = null;

    try {
        stats = await getUserStats(DEMO_USER_ID);
    } catch {
        // Database not connected
    }

    const categories = ["CHARACTER", "ZONE", "MOUNT", "ABILITY", "QUOTE"];

    return (
        <>
            <PageHeader
                title="Estatísticas"
                subtitle="Seu desempenho detalhado em cada categoria"
            />

            {/* Category breakdown */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
                {categories.map((cat) => (
                    <StatCard
                        key={cat}
                        icon={categoryIcons[cat]}
                        label={categoryLabels[cat]}
                        value="—"
                        description="Em breve"
                        color={categoryColors[cat]}
                    />
                ))}
            </div>

            {/* Overall stats */}
            <section className="p-6 rounded-lg border border-gold/10 bg-white/2">
                <h2 className="font-(family-name:--font-cinzel) text-lg font-bold text-amber-100/80 mb-6">
                    Resumo Geral
                </h2>

                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="text-center p-4 rounded-lg bg-white/2">
                        <p className="font-(family-name:--font-cinzel) text-3xl font-bold text-gold">
                            {stats?.totalGuesses ?? 0}
                        </p>
                        <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-1">
                            Total de Tentativas
                        </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/2">
                        <p className="font-(family-name:--font-cinzel) text-3xl font-bold text-emerald-400">
                            {stats?.correctGuesses ?? 0}
                        </p>
                        <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-1">
                            Acertos
                        </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-white/2">
                        <p className="font-(family-name:--font-cinzel) text-3xl font-bold text-sky-400">
                            {stats?.accuracy ?? 0}%
                        </p>
                        <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-1">
                            Precisão
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default function StatsPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <StatsContent />
        </Suspense>
    );
}
