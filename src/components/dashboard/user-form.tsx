"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/warcraftcn/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipTitle,
} from "@/components/ui/warcraftcn/tooltip";
import { cn } from "@/lib/utils";

interface UserFormProps {
  initialData?: {
    id?: string;
    name?: string | null;
    email?: string;
    role?: "USER" | "ADMIN";
    faction?: "HORDE" | "ALLIANCE" | null;
    image?: string | null;
  };
  onSubmit: (data: Record<string, unknown>) => Promise<{ error?: string; user?: unknown }>;
  submitLabel: string;
  backHref: string;
  showRoleField?: boolean;
}

const inputClasses =
  "w-full px-4 py-3 bg-[hsl(223,24%,11%)] border border-gold/15 rounded-md text-amber-100/90 font-(family-name:--font-crimson) text-sm placeholder:text-amber-100/20 focus:outline-none focus:border-gold/40 focus:shadow-[0_0_12px_rgba(242,201,76,0.08)] transition-all duration-200";

const labelClasses =
  "block font-(family-name:--font-cinzel) text-amber-100/60 text-xs uppercase tracking-wider mb-2";

export function UserForm({
  initialData,
  onSubmit,
  submitLabel,
  backHref,
  showRoleField = false,
}: UserFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [role, setRole] = useState<"USER" | "ADMIN">(initialData?.role ?? "USER");
  const [faction, setFaction] = useState<"HORDE" | "ALLIANCE" | "">(
    initialData?.faction ?? ""
  );
  const [image, setImage] = useState(initialData?.image ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const data: Record<string, unknown> = {
        name,
        email,
        ...(showRoleField && { role }),
        ...(faction && { faction }),
        ...(image && { image }),
      };

      const result = await onSubmit(data);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(backHref);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {error && (
        <div className="px-4 py-3 rounded-md border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-(family-name:--font-crimson)">
          {error}
        </div>
      )}

      {/* Nome */}
      <div>
        <label htmlFor="name" className={labelClasses}>
          Nome
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do usuário"
          required
          minLength={2}
          maxLength={50}
          className={inputClasses}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          required
          className={inputClasses}
        />
      </div>

      {/* Role */}
      {showRoleField && (
        <div>
          <label htmlFor="role" className={labelClasses}>
            Cargo
          </label>
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-md border text-sm font-(family-name:--font-cinzel) transition-all duration-200",
                    role === "USER"
                      ? "border-gold/30 bg-gold/10 text-gold"
                      : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20"
                  )}
                >
                  Usuário
                </button>
              </TooltipTrigger>
              <TooltipContent variant="default">
                <TooltipTitle>Usuário</TooltipTitle>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-md border text-sm font-(family-name:--font-cinzel) transition-all duration-200",
                    role === "ADMIN"
                      ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                      : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20"
                  )}
                >
                  Admin
                </button>
              </TooltipTrigger>
              <TooltipContent variant="epic">
                <TooltipTitle>Administrador</TooltipTitle>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Faction */}
      <div>
        <label className={labelClasses}>Facção</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFaction(faction === "ALLIANCE" ? "" : "ALLIANCE")}
            className={cn(
              "flex-1 px-4 py-3 rounded-md border text-sm font-(family-name:--font-cinzel) transition-all duration-200",
              faction === "ALLIANCE"
                ? "border-alliance/30 bg-alliance/10 text-alliance"
                : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20"
            )}
          >
            🦁 Aliança
          </button>
          <button
            type="button"
            onClick={() => setFaction(faction === "HORDE" ? "" : "HORDE")}
            className={cn(
              "flex-1 px-4 py-3 rounded-md border text-sm font-(family-name:--font-cinzel) transition-all duration-200",
              faction === "HORDE"
                ? "border-horde/30 bg-horde/10 text-horde"
                : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20"
            )}
          >
            🐺 Horda
          </button>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className={labelClasses}>
          Avatar (URL)
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
          className={inputClasses}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : submitLabel}
        </Button>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="px-5 py-3 rounded-md border border-gold/10 text-amber-100/40 text-sm font-(family-name:--font-cinzel) hover:border-gold/20 hover:text-amber-100/60 transition-all duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
