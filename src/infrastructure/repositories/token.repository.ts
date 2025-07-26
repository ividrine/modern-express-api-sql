import { db } from "../clients/db.client";
import type {
  SelectableToken,
  InsertableToken,
  PublicUser
} from "../types/wrappers";

import { USER_COLUMNS } from "./user.repository";

const USER_JOIN_COLUMNS = USER_COLUMNS.map(
  (col) => `user.${col}`
) as ReadonlyArray<keyof PublicUser>;

const insertOne = async (token: InsertableToken) => {
  return await db
    .insertInto("token")
    .values(token)
    .returningAll()
    .executeTakeFirstOrThrow();
};

const findOne = async (criteria: Partial<SelectableToken>) => {
  return await Object.keys(criteria)
    .reduce((acc, key) => {
      const value = criteria[key as keyof SelectableToken];
      if (value) acc.where(key as keyof SelectableToken, "=", value);
      return acc;
    }, db.selectFrom("token"))
    .selectAll()
    .executeTakeFirst();
};

const findOneUser = async (criteria: Partial<SelectableToken>) => {
  return await Object.keys(criteria)
    .reduce(
      (acc, key) => {
        const value = criteria[key as keyof SelectableToken];
        if (value) acc.where(key as keyof SelectableToken, "=", value);
        return acc;
      },
      db
        .selectFrom("token")
        .innerJoin("user", "user.id", "userId")
        .select(USER_JOIN_COLUMNS)
    )
    .executeTakeFirst();
};

const deleteOne = async (id: string) => {
  return await db
    .deleteFrom("token")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

const deleteMany = async (userId: string, type: string) => {
  return await db
    .deleteFrom("token")
    .where("userId", "=", userId)
    .where("type", "=", type)
    .returningAll()
    .execute();
};

export default {
  insertOne,
  findOne,
  findOneUser,
  deleteOne,
  deleteMany
};
