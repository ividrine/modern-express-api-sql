/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Prisma } from "@prisma/client";

export type PrismaQuery<T> = Omit<Prisma.Args<T, "findMany">, "skip" | "take">;

export type PaginationArgs<T> = {
  page?: number;
  pageSize?: number;
  query?: PrismaQuery<T>;
};

export type PaginationResult<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export const paginateExtension = Prisma.defineExtension({
  name: "paginateExtension",
  model: {
    $allModels: {
      async paginate<T>(
        this: T,
        args: PaginationArgs<T> = {} as PaginationArgs<T>
      ) {
        const context = Prisma.getExtensionContext(this);

        const { page = 1, pageSize = 10, query = {} as PrismaQuery<T> } = args;

        const {
          orderBy = { id: "asc" },
          where,
          include,
          select,
          ...other
        } = query;

        const take = Math.max(1, pageSize);
        const skip = Math.max(0, (page - 1) * pageSize);

        const [data, total] = await Promise.all([
          (context as any).findMany({
            skip,
            take,
            orderBy,
            where,
            include,
            select,
            ...other
          }),
          (context as any).count({ where })
        ]);

        return {
          data,
          meta: {
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }
        };
      }
    }
  }
});

export default paginateExtension;
