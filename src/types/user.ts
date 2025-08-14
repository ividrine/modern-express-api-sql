import { User } from "@prisma/client";

export type InsertableUser = Omit<
  User,
  "createdAt" | "updatedAt" | "isEmailVerified" | "id"
>;
export type SelectableUser = Omit<User, "password">;
export type UpdatableUser = Omit<User, "createdAt" | "updatedAt" | "id">;
export type AuthUser = Pick<User, "id" | "role">;
