import { PrismaClient } from "@prisma/client";
import paginateExtension from "./extensions/paginate.js";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
});

const xPrisma = prisma.$extends(paginateExtension);

export const initSql = async () => {
  await prisma.$connect();
};

export const closeSql = async () => {
  await prisma.$disconnect();
};

export default xPrisma;
