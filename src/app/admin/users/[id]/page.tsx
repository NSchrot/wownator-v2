"use client";

import { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { UserForm } from "@/components/dashboard/user-form";
import { FormSkeleton } from "@/components/dashboard/skeleton-loader";
import { getUser, updateUser } from "@/lib/actions/admin-actions";
import type { UpdateUserInput } from "@/lib/validations/user";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    role: "USER" | "ADMIN";
    faction: "HORDE" | "ALLIANCE" | null;
    image: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getUser(id)
      .then((data) => {
        if (data) {
          setUser(data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <PageHeader title="Editar Usuário" subtitle="Carregando..." />
        <FormSkeleton />
      </>
    );
  }

  if (notFound || !user) {
    return (
      <>
        <PageHeader title="Usuário não encontrado" />
        <div className="text-center py-12 rounded-lg border border-gold/8 bg-white/2">
          <p className="text-amber-100/30 font-(family-name:--font-crimson) text-sm">
            O usuário solicitado não existe ou foi removido.
          </p>
        </div>
      </>
    );
  }

  const factionEmoji =
    user.faction === "HORDE" ? "🐺" : user.faction === "ALLIANCE" ? "🦁" : "⚔️";

  return (
    <>
      <PageHeader
        title="Editar Usuário"
        subtitle={`Editando: ${user.name ?? user.email}`}
      />

      {/* User preview */}
      <div className="flex items-center gap-4 mb-8 p-4 rounded-lg border border-gold/10 bg-white/2">
        <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-xl shrink-0">
          {factionEmoji}
        </div>
        <div>
          <p className="font-(family-name:--font-crimson) text-amber-100/80 font-semibold">
            {user.name ?? "Sem nome"}
          </p>
          <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm">
            {user.email}
          </p>
        </div>
        <span
          className={`ml-auto px-2 py-0.5 rounded text-[10px] font-(family-name:--font-cinzel) uppercase tracking-wider border ${
            user.role === "ADMIN"
              ? "border-purple-500/30 text-purple-400 bg-purple-500/5"
              : "border-gold/15 text-gold/50 bg-gold/5"
          }`}
        >
          {user.role === "ADMIN" ? "Admin" : "User"}
        </span>
      </div>

      <UserForm
        initialData={user}
        onSubmit={async (data) => {
          const result = await updateUser(id, data as UpdateUserInput);
          if ("error" in result && result.error) return { error: result.error };
          return { user: "user" in result ? result.user : null };
        }}
        submitLabel="Salvar Alterações"
        backHref="/admin/users"
        showRoleField
      />
    </>
  );
}
