"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/warcraftcn/button";

interface DeleteConfirmProps {
    userName: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export function DeleteConfirm({ userName, onConfirm, onCancel }: DeleteConfirmProps) {
    const [isPending, startTransition] = useTransition();
    const [confirmed, setConfirmed] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md mx-4 p-6 rounded-lg border border-red-500/20 bg-[hsl(220,24%,9%)] shadow-2xl">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <h3 className="font-(family-name:--font-cinzel) text-amber-100/90 text-lg font-bold mb-2">
                        Excluir Usuário
                    </h3>
                    <p className="font-(family-name:--font-crimson) text-amber-100/50 text-sm mb-6">
                        Tem certeza que deseja excluir <span className="text-amber-100/80 font-semibold">{userName}</span>?
                        Esta ação pode ser revertida pelo banco de dados.
                    </p>

                    {!confirmed ? (
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmed(true)}
                                className="px-5 py-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-(family-name:--font-cinzel) hover:bg-red-500/20 transition-all duration-200"
                            >
                                Sim, excluir
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-5 py-3 rounded-md border border-gold/10 text-amber-100/40 text-sm font-(family-name:--font-cinzel) hover:border-gold/20 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-red-400/80 text-xs font-(family-name:--font-crimson)">
                                Clique novamente para confirmar a exclusão
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    disabled={isPending}
                                    onClick={() =>
                                        startTransition(async () => {
                                            await onConfirm();
                                        })
                                    }
                                    className="!border-red-500/50"
                                >
                                    {isPending ? "Excluindo..." : "Confirmar Exclusão"}
                                </Button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-5 py-3 rounded-md border border-gold/10 text-amber-100/40 text-sm font-(family-name:--font-cinzel) hover:border-gold/20 transition-all duration-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
