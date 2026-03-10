"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/user";

export async function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      faction: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const parsed = updateProfileSchema.parse(data);

  if (parsed.email) {
    const existing = await prisma.user.findFirst({
      where: { email: parsed.email, id: { not: userId } },
    });
    if (existing) {
      return { error: "Um usuário com este email já existe." };
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: parsed,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { user };
}

export async function getUserStats(userId: string) {
  const [totalGuesses, correctGuesses, recentGuesses] = await Promise.all([
    prisma.guess.count({ where: { userId } }),
    prisma.guess.count({ where: { userId, correct: true } }),
    prisma.guess.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { challenge: true },
    }),
  ]);

  return {
    totalGuesses,
    correctGuesses,
    accuracy:
      totalGuesses > 0
        ? Math.round((correctGuesses / totalGuesses) * 100)
        : 0,
    recentGuesses,
  };
}
