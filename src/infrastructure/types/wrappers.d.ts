import type { Selectable, Insertable, Updateable } from "kysely";
import type { User, Token } from "./db";

export type SelectableUser = Selectable<User>;
export type InsertableUser = Insertable<User>;
export type UpdatableUser = Updateable<User>;

export type SelectableToken = Selectable<Token>;
export type InsertableToken = Insertable<Token>;
export type UpdatableToken = Updateable<Token>;
