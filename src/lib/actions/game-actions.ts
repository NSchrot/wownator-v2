"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import type {
  FeedbackStatus,
  AttributeFeedback,
  GuessResult,
  GuessCharacterInfo,
  GameState,
  CharacterSearchResult,
} from "@/lib/types/game";

// ---------------------------------------------------------------------------
// Expansion ordering for PARTIAL logic
// ---------------------------------------------------------------------------
const EXPANSION_ORDER: Record<string, number> = {
  classic: 0,
  "the burning crusade": 1,
  "wrath of the lich king": 2,
  cataclysm: 3,
  "mists of pandaria": 4,
  "warlords of draenor": 5,
  legion: 6,
  "battle for azeroth": 7,
  shadowlands: 8,
  dragonflight: 9,
  "the war within": 10,
};

function getExpansionIndex(expansion: string | null): number | null {
  if (!expansion) return null;
  return EXPANSION_ORDER[expansion.toLowerCase()] ?? null;
}

// ---------------------------------------------------------------------------
// Attribute comparison logic
// ---------------------------------------------------------------------------
function compareAttribute(
  guessVal: string | null,
  targetVal: string | null,
): FeedbackStatus {
  const g = (guessVal ?? "").toLowerCase().trim();
  const t = (targetVal ?? "").toLowerCase().trim();

  if (g === t) return "CORRECT";
  return "INCORRECT";
}

function compareExpansion(
  guessVal: string | null,
  targetVal: string | null,
): FeedbackStatus {
  const g = (guessVal ?? "").toLowerCase().trim();
  const t = (targetVal ?? "").toLowerCase().trim();

  if (g === t) return "CORRECT";

  const gIdx = getExpansionIndex(guessVal);
  const tIdx = getExpansionIndex(targetVal);

  if (gIdx !== null && tIdx !== null && Math.abs(gIdx - tIdx) === 1) {
    return "PARTIAL";
  }

  return "INCORRECT";
}

function buildFeedback(
  guess: { faction: string | null; race: string | null; class: string | null; expansion: string | null; zone: string | null; role: string | null },
  target: { faction: string | null; race: string | null; class: string | null; expansion: string | null; zone: string | null; role: string | null },
): AttributeFeedback {
  return {
    faction: compareAttribute(guess.faction, target.faction),
    race: compareAttribute(guess.race, target.race),
    class: compareAttribute(guess.class, target.class),
    expansion: compareExpansion(guess.expansion, target.expansion),
    zone: compareAttribute(guess.zone, target.zone),
    role: compareAttribute(guess.role, target.role),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getTodayDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

async function getTodayChallenge() {
  const { start, end } = getTodayDateRange();
  return prisma.dailyChallenge.findFirst({
    where: {
      category: "CHARACTER",
      date: { gte: start, lt: end },
    },
    include: { character: true },
  });
}

function toCharacterInfo(c: {
  id: number;
  name: string;
  faction: string | null;
  race: string | null;
  class: string | null;
  expansion: string | null;
  zone: string | null;
  role: string | null;
  imageUrl: string | null;
}): GuessCharacterInfo {
  return {
    id: c.id,
    name: c.name,
    faction: c.faction,
    race: c.race,
    class: c.class,
    expansion: c.expansion,
    zone: c.zone,
    role: c.role,
    imageUrl: c.imageUrl,
  };
}

// ---------------------------------------------------------------------------
// submitCharacterGuess
// ---------------------------------------------------------------------------
export async function submitCharacterGuess(
  characterId: number,
): Promise<{ error?: string; result?: GuessResult }> {
  try {
    const userId = await getCurrentUserId();

    const challenge = await getTodayChallenge();
    if (!challenge || !challenge.character) {
      return { error: "Nenhum desafio de personagem disponível hoje." };
    }

    // Check if already solved
    const alreadySolved = await prisma.guess.findFirst({
      where: {
        userId,
        challengeId: challenge.id,
        correct: true,
      },
    });
    if (alreadySolved) {
      return { error: "Você já acertou o desafio de hoje!" };
    }

    // Check if character was already guessed
    const alreadyGuessed = await prisma.guess.findFirst({
      where: {
        userId,
        challengeId: challenge.id,
        characterId,
      },
    });
    if (alreadyGuessed) {
      return { error: "Você já tentou esse personagem hoje." };
    }

    // Load guessed character
    const guessedChar = await prisma.character.findUnique({
      where: { id: characterId },
    });
    if (!guessedChar) {
      return { error: "Personagem não encontrado." };
    }

    const target = challenge.character;

    // Build feedback (NEVER send target data to client)
    const feedback = buildFeedback(guessedChar, target);
    const isCorrect = guessedChar.id === target.id;

    // Calculate attempt number
    const previousAttempts = await prisma.guess.count({
      where: { userId, challengeId: challenge.id },
    });
    const attempt = previousAttempts + 1;

    // Save guess
    await prisma.guess.create({
      data: {
        userId,
        challengeId: challenge.id,
        characterId: guessedChar.id,
        correct: isCorrect,
        attempt,
      },
    });

    return {
      result: {
        character: toCharacterInfo(guessedChar),
        feedback,
        correct: isCorrect,
        attempt,
      },
    };
  } catch (err) {
    console.error("[submitCharacterGuess]", err);
    return { error: "Erro interno ao processar o palpite." };
  }
}

// ---------------------------------------------------------------------------
// searchCharacters
// ---------------------------------------------------------------------------
export async function searchCharacters(
  query: string,
): Promise<CharacterSearchResult[]> {
  try {
    if (!query || query.trim().length < 2) return [];

    const userId = await getCurrentUserId();

    const challenge = await getTodayChallenge();
    if (!challenge) return [];

    // Get IDs already guessed today
    const guessedIds = await prisma.guess.findMany({
      where: { userId, challengeId: challenge.id },
      select: { characterId: true },
    });
    const excludeIds = guessedIds
      .map((g) => g.characterId)
      .filter((id): id is number => id !== null);

    const characters = await prisma.character.findMany({
      where: {
        name: { contains: query.trim() },
        ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      },
      select: { id: true, name: true, imageUrl: true },
      take: 10,
    });

    return characters;
  } catch (err) {
    console.error("[searchCharacters]", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// getGameState — SSR initial load
// ---------------------------------------------------------------------------
export async function getGameState(): Promise<GameState> {
  try {
    const userId = await getCurrentUserId();

    const challenge = await getTodayChallenge();
    if (!challenge || !challenge.character) {
      return { challengeExists: false, solved: false, guesses: [] };
    }

    const target = challenge.character;

    const userGuesses = await prisma.guess.findMany({
      where: { userId, challengeId: challenge.id },
      include: { character: true },
      orderBy: { attempt: "asc" },
    });

    const guesses: GuessResult[] = userGuesses
      .filter((g) => g.character !== null)
      .map((g) => {
        const char = g.character!;
        return {
          character: toCharacterInfo(char),
          feedback: buildFeedback(char, target),
          correct: g.correct,
          attempt: g.attempt,
        };
      });

    const solved = userGuesses.some((g) => g.correct);

    return { challengeExists: true, solved, guesses };
  } catch (err) {
    console.error("[getGameState]", err);
    return { challengeExists: false, solved: false, guesses: [] };
  }
}
