import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50),
  email: z.string().email("Email inválido"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
  faction: z.enum(["HORDE", "ALLIANCE"]).nullable().optional(),
  image: z.string().url("URL inválida").nullable().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50).optional(),
  email: z.string().email("Email inválido").optional(),
  faction: z.enum(["HORDE", "ALLIANCE"]).nullable().optional(),
  image: z.string().url("URL inválida").nullable().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
