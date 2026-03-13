"use client";

import { useState, useCallback } from "react";
import { submitCharacterGuess } from "@/lib/actions/game-actions";
import { CharacterSearch } from "./character-search";
import { GuessBoard } from "./guess-board";
import type { GameState, GuessResult } from "@/lib/types/game";

type Props = {
  initialState: GameState;
};

export function GameProvider({ initialState }: Props) {
  const [guesses, setGuesses] = useState<GuessResult[]>(initialState.guesses);
  const [solved, setSolved] = useState(initialState.solved);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuess = useCallback(async (characterId: number) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitCharacterGuess(characterId);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.result) {
        setGuesses((prev) => [...prev, response.result!]);
        if (response.result.correct) {
          setSolved(true);
        }
      }
    } catch {
      setError("Falha ao enviar palpite. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center pt-4 pb-2">
        <h2 className="font-(family-name:--font-cinzel) text-2xl font-bold text-gold drop-shadow-[0_0_20px_rgba(212,168,67,0.15)]">
          Adivinhe o Personagem
        </h2>
        <div className="flex items-center gap-3 justify-center mt-2">
          <div className="w-10 h-px bg-linear-to-r from-transparent to-gold/20" />
          <span className="text-gold/30 text-xs">⚔</span>
          <div className="w-10 h-px bg-linear-to-l from-transparent to-gold/20" />
        </div>
        <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm mt-2">
          {solved
            ? "🎉 Parabéns, campeão! Você acertou!"
            : `Tentativa ${guesses.length + 1} — Compare os atributos e descubra o personagem do dia`}
        </p>
      </div>

      {/* Search */}
      <CharacterSearch
        onGuess={handleGuess}
        disabled={solved || isSubmitting}
        isSubmitting={isSubmitting}
      />

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-center">
          <p className="font-(family-name:--font-crimson) text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Victory banner */}
      {solved && (
        <div className="max-w-md mx-auto px-6 py-5 rounded-xl border border-gold/30 bg-gold/5 text-center cell-reveal">
          <span className="text-4xl block mb-2">🏆</span>
          <h3 className="font-(family-name:--font-cinzel) text-lg font-bold text-gold">
            Vitória!
          </h3>
          <p className="font-(family-name:--font-crimson) text-amber-100/50 text-sm mt-1">
            Você acertou em {guesses.length} tentativa{guesses.length > 1 ? "s" : ""}!
          </p>
        </div>
      )}

      {/* Guess Board */}
      <GuessBoard guesses={guesses} />
    </div>
  );
}
