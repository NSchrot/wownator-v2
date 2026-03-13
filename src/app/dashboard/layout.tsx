import { Sidebar } from "@/components/dashboard/sidebar";
import { Home, User, BarChart3, ArrowLeft } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Início",
    icon: <Home className="size-5" />,
    tooltip: "Painel principal",
  },
  {
    href: "/dashboard/profile",
    label: "Perfil",
    icon: <User className="size-5" />,
    tooltip: "Editar seu perfil",
  },
  {
    href: "/dashboard/stats",
    label: "Estatísticas",
    icon: <BarChart3 className="size-5" />,
    tooltip: "Seus resultados",
  },
  {
    href: "/",
    label: "Voltar ao Site",
    icon: <ArrowLeft className="size-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)]">
      <Sidebar
        title="WoWnator"
        subtitle="Painel do Jogador"
        items={navItems}
        accentColor="text-alliance"
      />

      <main className="lg:pl-64">
        <div className="px-6 py-8 lg:px-10 lg:py-10 pt-20 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
