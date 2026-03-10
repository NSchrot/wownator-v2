import { PageHeader } from "@/components/dashboard/page-header";

export default function AdminSettingsPage() {
    return (
        <>
            <PageHeader
                title="Configurações"
                subtitle="Configurações do sistema WoWnator"
            />

            <div className="space-y-6 max-w-2xl">
                {/* System info */}
                <div className="p-6 rounded-lg border border-gold/10 bg-white/2">
                    <h2 className="font-(family-name:--font-cinzel) text-base font-bold text-amber-100/80 mb-4">
                        Informações do Sistema
                    </h2>
                    <div className="space-y-3">
                        {[
                            ["Versão", "WoWnator v2.0"],
                            ["Framework", "Next.js 16"],
                            ["Banco de Dados", "MySQL + Prisma"],
                            ["Status", "Operacional"],
                        ].map(([label, value]) => (
                            <div key={label} className="flex items-center justify-between py-2 border-b border-gold/5 last:border-0">
                                <span className="font-(family-name:--font-crimson) text-amber-100/50 text-sm">{label}</span>
                                <span className="font-(family-name:--font-cinzel) text-amber-100/80 text-sm">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Auth info */}
                <div className="p-6 rounded-lg border border-gold/10 bg-white/2">
                    <h2 className="font-(family-name:--font-cinzel) text-base font-bold text-amber-100/80 mb-4">
                        Autenticação
                    </h2>
                    <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm">
                        Sistema de autenticação via NextAuth v5. Configure provedores OAuth e credenciais
                        nas variáveis de ambiente.
                    </p>
                </div>
            </div>
        </>
    );
}
