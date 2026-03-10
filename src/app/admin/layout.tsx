import { Sidebar } from "@/components/dashboard/sidebar";
import { LayoutDashboard, Users, Settings, ArrowLeft } from "lucide-react";

const navItems = [
  {
    href: "/admin",
    label: "Painel",
    icon: <LayoutDashboard className="size-5" />,
    tooltip: "Visão geral do sistema",
  },
  {
    href: "/admin/users",
    label: "Usuários",
    icon: <Users className="size-5" />,
    tooltip: "Gerenciar usuários",
  },
  {
    href: "/admin/settings",
    label: "Configurações",
    icon: <Settings className="size-5" />,
    tooltip: "Configurações do sistema",
  },
  {
    href: "/",
    label: "Voltar ao Site",
    icon: <ArrowLeft className="size-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(220,20%,6%)]">
      <Sidebar
        title="WoWnator"
        subtitle="Painel Administrativo"
        items={navItems}
        accentColor="text-epic"
      />

      <main className="lg:pl-64">
        <div className="px-6 py-8 lg:px-10 lg:py-10 pt-20 lg:pt-10">
          {children}
        </div>
      </main>
    </div>
  );
}
