"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/warcraftcn/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipTitle,
} from "@/components/ui/warcraftcn/tooltip";
import { registerUser } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";

const inputClasses =
    "w-full px-4 py-3 bg-[hsl(223,24%,11%)] border border-gold/15 rounded-md text-amber-100/90 font-(family-name:--font-crimson) text-sm placeholder:text-amber-100/20 focus:outline-none focus:border-gold/40 focus:shadow-[0_0_12px_rgba(242,201,76,0.08)] transition-all duration-200";

const labelClasses =
    "block font-(family-name:--font-cinzel) text-amber-100/60 text-xs uppercase tracking-wider mb-2";

export default function RegisterPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [faction, setFaction] = useState<"HORDE" | "ALLIANCE" | "">("");

    const passwordsMatch = confirmPassword === "" || password === confirmPassword;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        startTransition(async () => {
            const result = await registerUser({
                name,
                email,
                password,
                confirmPassword,
                faction: faction || undefined,
            });

            if (result.error) {
                setError(result.error);
                return;
            }

            if (result.success) {
                router.push("/login");
            }
        });
    }

    return (
        <div className="p-8 rounded-lg border border-gold/10 bg-[hsl(223,24%,9%)] shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center">
                    <UserPlus className="size-6 text-gold/70" />
                </div>
                <h2 className="font-(family-name:--font-cinzel) text-xl font-bold text-amber-100/90">
                    Junte-se a Azeroth
                </h2>
                <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-2">
                    Crie sua conta e comece a jogar
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
                {/* Name */}
                <div>
                    <label htmlFor="name" className={labelClasses}>
                        Nome
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome de campeão"
                        required
                        minLength={2}
                        maxLength={50}
                        autoComplete="name"
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
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                            autoComplete="new-password"
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
                                <TooltipTitle>{showPassword ? "Ocultar" : "Mostrar"}</TooltipTitle>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {/* Password strength indicator */}
                    {password.length > 0 && (
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4].map((level) => {
                                const strength =
                                    password.length >= 12
                                        ? 4
                                        : password.length >= 9
                                            ? 3
                                            : password.length >= 6
                                                ? 2
                                                : 1;
                                const colors = [
                                    "bg-red-500",
                                    "bg-orange-500",
                                    "bg-amber-500",
                                    "bg-emerald-500",
                                ];
                                return (
                                    <div
                                        key={level}
                                        className={cn(
                                            "h-1 flex-1 rounded-full transition-all duration-300",
                                            level <= strength ? colors[strength - 1] : "bg-white/5"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className={labelClasses}>
                        Confirmar Senha
                    </label>
                    <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className={cn(
                            inputClasses,
                            !passwordsMatch && "border-red-500/40 focus:border-red-500/60"
                        )}
                    />
                    {!passwordsMatch && (
                        <p className="mt-1 text-red-400 text-xs font-(family-name:--font-crimson)">
                            As senhas não coincidem
                        </p>
                    )}
                </div>

                {/* Faction */}
                <div>
                    <label className={labelClasses}>
                        Facção <span className="text-amber-100/20">(opcional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFaction(faction === "ALLIANCE" ? "" : "ALLIANCE")}
                            className={cn(
                                "relative flex flex-col items-center gap-2 px-4 py-4 rounded-md border text-sm font-(family-name:--font-cinzel) transition-all duration-300 overflow-hidden",
                                faction === "ALLIANCE"
                                    ? "border-alliance/40 bg-alliance/8 text-alliance shadow-[0_0_20px_rgba(79,163,255,0.08)]"
                                    : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20 hover:bg-white/3"
                            )}
                        >
                            <span className="text-2xl">🦁</span>
                            <span className="text-xs tracking-wider">Aliança</span>
                            {faction === "ALLIANCE" && (
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,163,255,0.06),transparent_70%)]" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFaction(faction === "HORDE" ? "" : "HORDE")}
                            className={cn(
                                "relative flex flex-col items-center gap-2 px-4 py-4 rounded-md border text-sm font-(family-name:--font-cinzel) transition-all duration-300 overflow-hidden",
                                faction === "HORDE"
                                    ? "border-horde/40 bg-horde/8 text-horde shadow-[0_0_20px_rgba(211,58,58,0.08)]"
                                    : "border-gold/10 bg-white/2 text-amber-100/40 hover:border-gold/20 hover:bg-white/3"
                            )}
                        >
                            <span className="text-2xl">🐺</span>
                            <span className="text-xs tracking-wider">Horda</span>
                            {faction === "HORDE" && (
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(211,58,58,0.06),transparent_70%)]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isPending || !passwordsMatch}
                    className="w-full text-sm uppercase tracking-widest py-4 filter-[hue-rotate(130deg)_saturate(1.9)_brightness(0.90)] hover:filter-[hue-rotate(130deg)_saturate(2)_brightness(1)]"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-amber-100/30 border-t-gold rounded-full animate-spin" />
                            Criando conta...
                        </span>
                    ) : (
                        "Criar Conta"
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gold/10" />
                <span className="font-(family-name:--font-crimson) text-amber-100/20 text-xs">ou</span>
                <div className="flex-1 h-px bg-gold/10" />
            </div>

            {/* Login link */}
            <p className="text-center font-(family-name:--font-crimson) text-amber-100/50 text-sm">
                Já tem uma conta?{" "}
                <Link
                    href="/login"
                    className="text-gold hover:text-gold-light transition-colors font-semibold"
                >
                    Entrar
                </Link>
            </p>
        </div>
    );
}
