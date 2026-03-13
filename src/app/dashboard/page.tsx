import { Suspense } from "react";
import { Target, Trophy, Percent, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardSkeleton } from "@/components/dashboard/skeleton-loader";
import { getUserStats, getProfile } from "@/lib/actions/user-actions";

// TODO: Obter userId da sessão autenticada
const DEMO_USER_ID = "demo";

type Profile = {
    id: string;
    name: string | null;
    email: string;
    faction: "HORDE" | "ALLIANCE" | null;
    image: string | null;
    role: "USER" | "ADMIN";
    createdAt: Date;
};

type Stats = {
    totalGuesses: number;
    correctGuesses: number;
    accuracy: number;
    recentGuesses: Array<{
        id: number;
        userId: string;
        challengeId: number;
        correct: boolean;
        attempt: number;
        createdAt: Date;
        challenge: { id: number; date: Date; category: string };
    }>;
};

async function DashboardContent() {
    let profile: Profile | null = null;
    let stats: Stats | null = null;

    try {
        [profile, stats] = await Promise.all([
            getProfile(DEMO_USER_ID) as Promise<Profile | null>,
            getUserStats(DEMO_USER_ID) as Promise<Stats>,
        ]);
    } catch {
        // Database not connected — show empty state
    }

    const factionEmoji = profile?.faction === "HORDE" ? "🐺" : profile?.faction === "ALLIANCE" ? "🦁" : "⚔️";
    const factionLabel = profile?.faction === "HORDE" ? "Horda" : profile?.faction === "ALLIANCE" ? "Aliança" : "Sem facção";
    const factionColor = profile?.faction === "HORDE" ? "text-horde" : profile?.faction === "ALLIANCE" ? "text-alliance" : "text-gold";

    return (
        <>
            <PageHeader
                title={profile?.name ? `Lok'tar, ${profile.name}!` : "Bem-vindo, Campeão!"}
                subtitle="Acompanhe seu progresso e conquistas no mundo de Azeroth"
            />

            {/* Faction banner */}
            <div className="mb-8 p-4 rounded-lg border border-gold/10 bg-white/2 flex items-center gap-4">
                <span className="text-3xl">{factionEmoji}</span>
                <div>
                    <p className={`font-(family-name:--font-cinzel) font-bold text-base ${factionColor}`}>
                        {factionLabel}
                    </p>
                    <p className="font-(family-name:--font-crimson) text-amber-100/40 text-xs">
                        {profile?.email ?? "Configure seu perfil para começar"}
                    </p>
                </div>
                {profile?.createdAt && (
                    <p className="ml-auto font-(family-name:--font-crimson) text-amber-100/20 text-xs hidden sm:block">
                        Membro desde {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    icon={<Target className="size-5" />}
                    label="Tentativas"
                    value={stats?.totalGuesses ?? 0}
                    description="Total de palpites"
                    color="text-amber-400"
                    tooltip="Total de palpites realizados no jogo"
                />
                <StatCard
                    icon={<Trophy className="size-5" />}
                    label="Acertos"
                    value={stats?.correctGuesses ?? 0}
                    description="Respostas corretas"
                    color="text-emerald-400"
                    tooltip="Total de respostas corretas"
                />
                <StatCard
                    icon={<Percent className="size-5" />}
                    label="Precisão"
                    value={`${stats?.accuracy ?? 0}%`}
                    description="Taxa de acerto"
                    color="text-sky-400"
                    tooltip="Porcentagem de acertos sobre o total"
                />
                <StatCard
                    icon={<Clock className="size-5" />}
                    label="Recentes"
                    value={stats?.recentGuesses?.length ?? 0}
                    description="Últimos desafios"
                    color="text-purple-400"
                    tooltip="Desafios jogados recentemente"
                />
            </div>

            {/* Recent Activity */}
            <section>
                <h2 className="font-(family-name:--font-cinzel) text-lg font-bold text-amber-100/80 mb-4">
                    Atividade Recente
                </h2>
                <div className="space-y-2">
                    {stats?.recentGuesses && stats.recentGuesses.length > 0 ? (
                        stats.recentGuesses.map((guess) => (
                            <div
                                key={guess.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-gold/8 bg-white/2 hover:bg-white/3 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-2 h-2 rounded-full ${guess.correct ? "bg-emerald-500" : "bg-red-500"}`}
                                    />
                                    <div>
                                        <p className="font-(family-name:--font-crimson) text-amber-100/70 text-sm">
                                            Desafio #{guess.challengeId}
                                        </p>
                                        <p className="font-(family-name:--font-crimson) text-amber-100/30 text-xs">
                                            Tentativa {guess.attempt}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`font-(family-name:--font-cinzel) text-xs uppercase tracking-wider ${guess.correct ? "text-emerald-400" : "text-red-400"
                                        }`}
                                >
                                    {guess.correct ? "Acertou" : "Errou"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 rounded-lg border border-gold/8 bg-white/2">
                            <p className="text-amber-100/30 font-(family-name:--font-crimson) text-sm">
                                Nenhum desafio realizado ainda.
                            </p>
                            <p className="text-amber-100/20 font-(family-name:--font-crimson) text-xs mt-1">
                                Jogue o WoWnator para ver suas estatísticas aqui!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}
