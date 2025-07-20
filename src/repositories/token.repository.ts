import { db } from "../infrastructure/pg.client.js";
import type { Token, NewToken } from "../types/database.js";

export async function insertToken(token: NewToken) {
  return await db
    .insertInto("token")
    .values(token)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getTokenById(id: string) {
  return await db
    .selectFrom("token")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export const findOne = async (criteria: Partial<Token>) => {
  const select = db.selectFrom("token");
  const query = Object.keys(criteria).reduce((acc, key) => {
    const value = criteria[key as keyof Token];
    if (value) acc.where(key as keyof Token, "=", value);
    return acc;
  }, select);
  return await query.selectAll().executeTakeFirst();
};

export const deleteTokenByValue = async (token: string) => {
  return await db
    .deleteFrom("token")
    .where("token", "=", token)
    .returningAll()
    .executeTakeFirst();
};
