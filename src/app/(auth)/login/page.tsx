"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/warcraftcn/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipTitle,
  TooltipBody,
} from "@/components/ui/warcraftcn/tooltip";
import { loginUser } from "@/lib/actions/auth-actions";

const inputClasses =
  "w-full px-4 py-3 bg-[hsl(223,24%,11%)] border border-gold/15 rounded-md text-amber-100/90 font-(family-name:--font-crimson) text-sm placeholder:text-amber-100/20 focus:outline-none focus:border-gold/40 focus:shadow-[0_0_12px_rgba(242,201,76,0.08)] transition-all duration-200";

const labelClasses =
  "block font-(family-name:--font-cinzel) text-amber-100/60 text-xs uppercase tracking-wider mb-2";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginUser({ email, password });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success && result.user) {
        if (result.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    });
  }

  return (
    <div className="p-8 rounded-lg border border-gold/10 bg-[hsl(223,24%,9%)] shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center">
          <LogIn className="size-6 text-gold/70" />
        </div>
        <h2 className="font-(family-name:--font-cinzel) text-xl font-bold text-amber-100/90">
          Entrar em Azeroth
        </h2>
        <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-2">
          Faça login para acessar seus desafios
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-md border border-red-500/30 bg-red-500/5 text-red-400 text-sm font-(family-name:--font-crimson) flex items-center gap-2">
          <span className="shrink-0 text-red-400">✗</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="seu@email.com"
            required
            autoComplete="email"
            className={inputClasses}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={labelClasses}>
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="current-password"
              className={inputClasses + " pr-11"}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-100/20 hover:text-amber-100/50 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent variant="default">
                <TooltipTitle>{showPassword ? "Ocultar senha" : "Mostrar senha"}</TooltipTitle>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full text-sm uppercase tracking-widest py-4"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-amber-100/30 border-t-gold rounded-full animate-spin" />
              Entrando...
            </span>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gold/10" />
        <span className="font-(family-name:--font-crimson) text-amber-100/20 text-xs">ou</span>
        <div className="flex-1 h-px bg-gold/10" />
      </div>

      {/* Register link */}
      <p className="text-center font-(family-name:--font-crimson) text-amber-100/50 text-sm">
        Não tem uma conta?{" "}
        <Link
          href="/register"
          className="text-gold hover:text-gold-light transition-colors font-semibold"
        >
          Criar Conta
        </Link>
      </p>
    </div>
  );
}
