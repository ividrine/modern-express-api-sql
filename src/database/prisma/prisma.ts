import { PrismaClient } from "@prisma/client";
import paginateExtension from "./extensions/paginate.js";

const _prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
});

const prisma = _prisma.$extends(paginateExtension);

export const initSql = async () => {
  await _prisma.$connect();
};

export const closeSql = async () => {
  await _prisma.$disconnect();
};

export default prisma;
