import { Suspense } from "react";
import { getGameState } from "@/lib/actions/game-actions";
import { GameProvider } from "@/components/play/game-provider";

async function PlayContent() {
  const gameState = await getGameState();

  if (!gameState.challengeExists) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 mb-6">
          <span className="text-3xl">⚔️</span>
        </div>
        <h2 className="font-(family-name:--font-cinzel) text-xl font-bold text-gold mb-3">
          Nenhum Desafio Disponível
        </h2>
        <p className="font-(family-name:--font-crimson) text-amber-100/40 text-sm max-w-sm mx-auto">
          Ainda não há um desafio de personagem para hoje. Volte mais tarde, campeão!
        </p>
      </div>
    );
  }

  return <GameProvider initialState={gameState} />;
}

function PlaySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center py-6">
        <div className="h-8 w-64 bg-white/5 rounded mx-auto mb-2" />
        <div className="h-4 w-48 bg-white/5 rounded mx-auto" />
      </div>
      <div className="h-12 bg-white/5 rounded-lg max-w-md mx-auto" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-white/5 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<PlaySkeleton />}>
      <PlayContent />
    </Suspense>
  );
}
