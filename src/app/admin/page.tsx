import { Suspense } from "react";
import Link from "next/link";
import { Users, Shield, Swords, Crown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardSkeleton } from "@/components/dashboard/skeleton-loader";
import { Button } from "@/components/ui/warcraftcn/button";
import { getAdminStats } from "@/lib/actions/admin-actions";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipTitle,
    TooltipBody,
} from "@/components/ui/warcraftcn/tooltip";

type AdminStats = {
    totalUsers: number;
    adminCount: number;
    hordeCount: number;
    allianceCount: number;
    recentUsers: Array<{
        id: string;
        name: string | null;
        email: string;
        role: "USER" | "ADMIN";
        faction: "HORDE" | "ALLIANCE" | null;
        createdAt: Date;
    }>;
};

async function AdminContent() {
    let stats: AdminStats | null = null;

    try {
        stats = (await getAdminStats()) as AdminStats;
    } catch {
        // Database not connected
    }

    return (
        <>
            <PageHeader title="Painel Administrativo" subtitle="Visão geral do WoWnator">
                <Button asChild>
                    <Link href="/admin/users">Gerenciar Usuários</Link>
                </Button>
            </PageHeader>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    icon={<Users className="size-5" />}
                    label="Usuários"
                    value={stats?.totalUsers ?? 0}
                    description="Total de contas"
                    color="text-gold"
                    tooltip="Quantidade total de usuários registrados"
                />
                <StatCard
                    icon={<Crown className="size-5" />}
                    label="Admins"
                    value={stats?.adminCount ?? 0}
                    description="Administradores"
                    color="text-purple-400"
                    tooltip="Número de administradores do sistema"
                />
                <StatCard
                    icon={<Swords className="size-5" />}
                    label="Horda"
                    value={stats?.hordeCount ?? 0}
                    description="Jogadores da Horda"
                    color="text-horde"
                    tooltip="Jogadores que escolheram a Horda"
                />
                <StatCard
                    icon={<Shield className="size-5" />}
                    label="Aliança"
                    value={stats?.allianceCount ?? 0}
                    description="Jogadores da Aliança"
                    color="text-alliance"
                    tooltip="Jogadores que escolheram a Aliança"
                />
            </div>

            {/* Recent Users */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-(family-name:--font-cinzel) text-lg font-bold text-amber-100/80">
                        Usuários Recentes
                    </h2>
                    <Link
                        href="/admin/users"
                        className="font-(family-name:--font-cinzel) text-gold/60 text-xs uppercase tracking-wider hover:text-gold transition-colors"
                    >
                        Ver todos →
                    </Link>
                </div>

                <div className="space-y-2">
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                        stats.recentUsers.map((user) => (
                            <Tooltip key={user.id}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        className="flex items-center justify-between p-4 rounded-lg border border-gold/8 bg-white/2 hover:bg-white/4 hover:border-gold/15 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-sm shrink-0">
                                                {user.faction === "HORDE"
                                                    ? "🐺"
                                                    : user.faction === "ALLIANCE"
                                                        ? "🦁"
                                                        : "⚔️"}
                                            </div>
                                            <div>
                                                <p className="font-(family-name:--font-crimson) text-amber-100/80 text-sm group-hover:text-amber-100 transition-colors">
                                                    {user.name ?? "Sem nome"}
                                                </p>
                                                <p className="font-(family-name:--font-crimson) text-amber-100/30 text-xs">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-(family-name:--font-cinzel) uppercase tracking-wider border ${user.role === "ADMIN"
                                                        ? "border-purple-500/30 text-purple-400 bg-purple-500/5"
                                                        : "border-gold/15 text-gold/50 bg-gold/5"
                                                    }`}
                                            >
                                                {user.role === "ADMIN" ? "Admin" : "User"}
                                            </span>
                                            <span className="font-(family-name:--font-crimson) text-amber-100/20 text-xs hidden sm:block">
                                                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent variant={user.role === "ADMIN" ? "epic" : "default"}>
                                    <TooltipTitle>{user.name ?? user.email}</TooltipTitle>
                                    <TooltipBody>Clique para editar este usuário</TooltipBody>
                                </TooltipContent>
                            </Tooltip>
                        ))
                    ) : (
                        <div className="text-center py-12 rounded-lg border border-gold/8 bg-white/2">
                            <p className="text-amber-100/30 font-(family-name:--font-crimson) text-sm">
                                Nenhum usuário registrado no sistema.
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/admin/users/new">Criar Primeiro Usuário</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <AdminContent />
        </Suspense>
    );
}
