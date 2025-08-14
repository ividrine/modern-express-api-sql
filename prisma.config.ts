import type { PrismaConfig } from "prisma";
import path from "path";

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts"
  }
} satisfies PrismaConfig;
