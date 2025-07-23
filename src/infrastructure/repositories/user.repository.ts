import { db } from "../clients/db.client";
import {
  SelectableUser,
  InsertableUser,
  UpdatableUser
} from "../types/wrappers";

export const findUserById = async (id: string) => {
  return await db
    .selectFrom("user")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
};

export const test = async (id: string) => {
  return await db
    .selectFrom("user")
    .where("id", "=", id)
    .innerJoin("token", "token.userId", "user.id")
    .select(["user.id", "token.token as token"])
    .execute();
};

export async function findUsers(criteria: Partial<SelectableUser>) {
  let query = db.selectFrom("user");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.email) {
    query = query.where("email", "=", criteria.email);
  }

  if (criteria.created_at) {
    query = query.where("created_at", "=", criteria.created_at);
  }

  return await query.selectAll().execute();
}

export async function updateUser(id: string, updateWith: UpdatableUser) {
  await db.updateTable("user").set(updateWith).where("id", "=", id).execute();
}

export async function insertUser(user: InsertableUser) {
  return await db
    .insertInto("user")
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteUser(id: string) {
  return await db
    .deleteFrom("user")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function isEmailTaken(email: string, userId?: string) {
  let query = db.selectFrom("user").where("email", "=", email);

  if (userId) {
    query = query.where("id", "!=", userId);
  }

  return await query.selectAll().executeTakeFirst();
}
