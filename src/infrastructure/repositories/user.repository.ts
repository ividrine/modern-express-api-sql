import { db } from "../clients/db.client";
import {
  SelectableUser,
  InsertableUser,
  UpdatableUser
} from "../types/wrappers";

export const USER_COLUMNS = [
  "id",
  "username",
  "email",
  "role",
  "is_email_verified",
  "created_at",
  "updated_at",
  "metadata"
] satisfies ReadonlyArray<keyof SelectableUser>;

const insertOne = async (user: InsertableUser) => {
  return await db
    .insertInto("user")
    .values(user)
    .returning(USER_COLUMNS)
    .executeTakeFirstOrThrow();
};

const findByEmailOrUsername = async (identifier: string) => {
  return await db
    .selectFrom("user")
    .where((eb) =>
      eb.or([eb("email", "=", identifier), eb("username", "=", identifier)])
    )
    .selectAll()
    .executeTakeFirst();
};

const findOne = async (criteria: Partial<SelectableUser>) => {
  return Object.keys(criteria)
    .reduce((acc, key) => {
      const value = criteria[key as keyof SelectableUser];
      if (value) acc = acc.where(key as keyof SelectableUser, "=", value);
      return acc;
    }, db.selectFrom("user"))
    .select(USER_COLUMNS)
    .executeTakeFirst();
};

const findMany = async (criteria: Partial<SelectableUser>) => {
  return Object.keys(criteria)
    .reduce((acc, key) => {
      const value = criteria[key as keyof SelectableUser];
      if (value) acc = acc.where(key as keyof SelectableUser, "=", value);
      return acc;
    }, db.selectFrom("user"))
    .select(USER_COLUMNS)
    .execute();
};

const updateOne = async (id: string, updateWith: UpdatableUser) => {
  await db.updateTable("user").set(updateWith).where("id", "=", id).execute();
};

const deleteOne = async (id: string) => {
  return await db
    .deleteFrom("user")
    .where("id", "=", id)
    .returning(USER_COLUMNS)
    .executeTakeFirst();
};

const isEmailTaken = async (email: string, userId?: string) => {
  let query = db.selectFrom("user").where("email", "=", email);
  if (userId) {
    query = query.where("id", "!=", userId);
  }
  return await query.select(USER_COLUMNS).executeTakeFirst();
};

const isUsernameTaken = async (username: string) => {
  return await db
    .selectFrom("user")
    .where("username", "=", username)
    .select(USER_COLUMNS)
    .execute();
};

export default {
  insertOne,
  findByEmailOrUsername,
  findOne,
  findMany,
  updateOne,
  deleteOne,
  isEmailTaken,
  isUsernameTaken
};
