"use client";

import { Suspense, useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { UserForm } from "@/components/dashboard/user-form";
import { ProfileSkeleton } from "@/components/dashboard/skeleton-loader";
import { getProfile, updateProfile } from "@/lib/actions/user-actions";

// TODO: Obter userId da sessão autenticada
const DEMO_USER_ID = "demo";

function ProfileContent() {
  const [profile, setProfile] = useState<{
    id: string;
    name: string | null;
    email: string;
    faction: "HORDE" | "ALLIANCE" | null;
    image: string | null;
    role: "USER" | "ADMIN";
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile(DEMO_USER_ID)
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProfileSkeleton />;

  const factionEmoji =
    profile?.faction === "HORDE" ? "🐺" : profile?.faction === "ALLIANCE" ? "🦁" : "⚔️";

  return (
    <>
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e preferências"
      />

      {/* Avatar preview */}
      <div className="flex items-center gap-5 mb-8 p-5 rounded-lg border border-gold/10 bg-white/2">
        <div className="w-16 h-16 rounded-full bg-gold/5 border-2 border-gold/20 flex items-center justify-center text-2xl shrink-0">
          {profile?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            factionEmoji
          )}
        </div>
        <div>
          <p className="font-(family-name:--font-cinzel) text-amber-100/90 font-bold">
            {profile?.name ?? "Campeão Anônimo"}
          </p>
          <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm">
            {profile?.email ?? "Nenhum email definido"}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-(family-name:--font-cinzel) uppercase tracking-wider border border-gold/20 text-gold/60">
            {profile?.role === "ADMIN" ? "Administrador" : "Jogador"}
          </span>
        </div>
      </div>

      <UserForm
        initialData={
          profile
            ? {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                faction: profile.faction,
                image: profile.image,
              }
            : undefined
        }
        onSubmit={async (data) => {
          const result = await updateProfile(DEMO_USER_ID, data as Parameters<typeof updateProfile>[1]);
          if ("error" in result && result.error) return { error: result.error };
          return { user: "user" in result ? result.user : null };
        }}
        submitLabel="Salvar Perfil"
        backHref="/dashboard"
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
