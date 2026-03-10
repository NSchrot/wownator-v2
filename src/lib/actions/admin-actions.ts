"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/lib/validations/user";

export async function listUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  perPage?: number;
}) {
  const { search, role, page = 1, perPage = 10 } = params ?? {};

  const where: Record<string, unknown> = { deletedAt: null };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (role === "USER" || role === "ADMIN") {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        faction: true,
        image: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      faction: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createUser(data: CreateUserInput) {
  const parsed = createUserSchema.parse(data);

  const existing = await prisma.user.findUnique({
    where: { email: parsed.email },
  });
  if (existing) {
    return { error: "Um usuário com este email já existe." };
  }

  const user = await prisma.user.create({ data: parsed });

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return { user };
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const parsed = updateUserSchema.parse(data);

  if (parsed.email) {
    const existing = await prisma.user.findFirst({
      where: { email: parsed.email, id: { not: id } },
    });
    if (existing) {
      return { error: "Um usuário com este email já existe." };
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  revalidatePath("/admin");

  return { user };
}

export async function deleteUser(id: string) {
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return { success: true };
}

export async function getAdminStats() {
  const [totalUsers, adminCount, hordeCount, allianceCount, recentUsers] =
    await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { role: "ADMIN", deletedAt: null } }),
      prisma.user.count({ where: { faction: "HORDE", deletedAt: null } }),
      prisma.user.count({ where: { faction: "ALLIANCE", deletedAt: null } }),
      prisma.user.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          faction: true,
          createdAt: true,
        },
      }),
    ]);

  return { totalUsers, adminCount, hordeCount, allianceCount, recentUsers };
}
