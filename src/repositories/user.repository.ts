import { db } from "../infrastructure/pg.client.js";
import type { UserUpdate, User, NewUser } from "../types/database.js";

export async function findUserById(id: string) {
  return await db
    .selectFrom("user")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findUserByEmail(email: string) {
  return await db
    .selectFrom("user")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
}
export async function findUsers(criteria: Partial<User>) {
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

export async function updateUser(id: string, updateWith: UserUpdate) {
  await db.updateTable("user").set(updateWith).where("id", "=", id).execute();
}

export async function insertUser(user: NewUser) {
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
