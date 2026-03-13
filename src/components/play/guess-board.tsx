"use client";

import type { GuessResult, FeedbackStatus } from "@/lib/types/game";

type Props = {
  guesses: GuessResult[];
};

const ATTRIBUTES = [
  { key: "name" as const, label: "Nome" },
  { key: "faction" as const, label: "Facção" },
  { key: "race" as const, label: "Raça" },
  { key: "class" as const, label: "Classe" },
  { key: "expansion" as const, label: "Expansão" },
  { key: "zone" as const, label: "Zona" },
  { key: "role" as const, label: "Role" },
] as const;

type AttributeKey = (typeof ATTRIBUTES)[number]["key"];

function feedbackColor(status: FeedbackStatus): string {
  switch (status) {
    case "CORRECT":
      return "bg-emerald-600/80 border-emerald-500/40";
    case "PARTIAL":
      return "bg-amber-600/80 border-amber-500/40";
    case "INCORRECT":
      return "bg-red-600/50 border-red-500/30";
  }
}

function feedbackIcon(status: FeedbackStatus): string {
  switch (status) {
    case "CORRECT":
      return "✓";
    case "PARTIAL":
      return "~";
    case "INCORRECT":
      return "✗";
  }
}

function getCellValue(guess: GuessResult, key: AttributeKey): string {
  if (key === "name") return guess.character.name;
  return guess.character[key] ?? "—";
}

function getCellFeedback(guess: GuessResult, key: AttributeKey): FeedbackStatus {
  if (key === "name") return guess.correct ? "CORRECT" : "INCORRECT";
  return guess.feedback[key];
}

export function GuessBoard({ guesses }: Props) {
  if (guesses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-(family-name:--font-crimson) text-amber-100/20 text-sm">
          Seus palpites aparecerão aqui...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      {/* Header row */}
      <div className="grid grid-cols-7 gap-1.5 mb-2 min-w-[700px]">
        {ATTRIBUTES.map((attr) => (
          <div
            key={attr.key}
            className="px-2 py-2 text-center font-(family-name:--font-cinzel) text-[11px] uppercase tracking-wider text-gold/50 font-bold"
          >
            {attr.label}
          </div>
        ))}
      </div>

      {/* Guess rows */}
      <div className="space-y-1.5 min-w-[700px]">
        {guesses.map((guess, rowIdx) => {
          const isNewRow = rowIdx === guesses.length - 1;

          return (
            <div key={`${guess.attempt}-${guess.character.id}`} className="grid grid-cols-7 gap-1.5">
              {ATTRIBUTES.map((attr, colIdx) => {
                const value = getCellValue(guess, attr.key);
                const status = getCellFeedback(guess, attr.key);
                const colorClasses = feedbackColor(status);
                const icon = feedbackIcon(status);

                return (
                  <div
                    key={attr.key}
                    className={`
                      relative px-2 py-3 rounded-lg border text-center overflow-hidden
                      ${colorClasses}
                      ${isNewRow ? "cell-reveal" : ""}
                    `}
                    style={isNewRow ? { animationDelay: `${colIdx * 150}ms` } : undefined}
                  >
                    {/* Content */}
                    <p className="font-(family-name:--font-crimson) text-white text-xs font-semibold leading-tight truncate">
                      {value}
                    </p>

                    {/* Status icon */}
                    {attr.key !== "name" && (
                      <span className="absolute top-1 right-1.5 text-white/30 text-[9px] font-bold">
                        {icon}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-600/80 border border-emerald-500/40" />
          <span className="font-(family-name:--font-crimson) text-amber-100/30 text-[11px]">Correto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-600/80 border border-amber-500/40" />
          <span className="font-(family-name:--font-crimson) text-amber-100/30 text-[11px]">Parcial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-600/50 border border-red-500/30" />
          <span className="font-(family-name:--font-crimson) text-amber-100/30 text-[11px]">Incorreto</span>
        </div>
      </div>
    </div>
  );
}
