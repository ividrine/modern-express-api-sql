import { db } from "../clients/db.client";
import { QueryObject, QueryOptions } from "../types/queries";
import filter from "../utils/filter";
import {
  InsertableUser,
  UpdatableUser,
  SelectableUser
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
  return (await db
    .insertInto("user")
    .values(user)
    .returning(USER_COLUMNS)
    .executeTakeFirstOrThrow()) as SelectableUser;
};

const findOne = async (
  query: QueryObject<SelectableUser> = {},
  options: QueryOptions = { omitSensitive: true }
) => {
  let qb = db.selectFrom("user");
  qb = filter(qb, query);
  qb = options.omitSensitive ? qb.select(USER_COLUMNS) : qb.selectAll();
  return (await qb.executeTakeFirst()) as SelectableUser;
};

const findMany = async (query: QueryObject<SelectableUser> = {}) => {
  let qb = db.selectFrom("user");
  qb = filter(qb, query);
  return (await qb.select(USER_COLUMNS).execute()) as SelectableUser[];
};

const updateOne = async (id: string, updateWith: UpdatableUser) => {
  await db.updateTable("user").set(updateWith).where("id", "=", id).execute();
};

const remove = async (query: QueryObject<SelectableUser> = {}) => {
  let qb = db.deleteFrom("user");
  qb = filter(qb, query);
  return await qb.returningAll().execute();
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
  findOne,
  findMany,
  updateOne,
  remove,
  isEmailTaken,
  isUsernameTaken
};
