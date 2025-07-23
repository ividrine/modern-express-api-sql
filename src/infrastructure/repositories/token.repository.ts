import { db } from "../clients/db.client";
import type { SelectableToken, InsertableToken } from "../types/wrappers";

export async function insertToken(token: InsertableToken) {
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
    .select(["userId", "type"])
    .executeTakeFirst();
}

export const findToken = async (criteria: Partial<SelectableToken>) => {
  const select = db.selectFrom("token");
  const query = Object.keys(criteria).reduce((acc, key) => {
    const value = criteria[key as keyof SelectableToken];
    if (value) acc.where(key as keyof SelectableToken, "=", value);
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
