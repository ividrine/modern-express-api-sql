import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable
} from "kysely";

export interface Database {
  user: UserTable;
  token: TokenTable;
}

export interface UserTable {
  id: Generated<string>;
  email: string;
  password: ColumnType<undefined, string, string>;
  role: string;
  created_at: ColumnType<Date, string | undefined, never>;
  metadata: JSONColumnType<{
    login_at: string;
    ip: string | null;
    agent: string | null;
  }>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface TokenTable {
  id: Generated<string>;
  userId: string;
  token: string;
  type: string;
  expires: Date;
  revoked: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export type Token = Selectable<TokenTable>;
export type NewToken = Insertable<TokenTable>;
export type TokenUpdate = Updateable<TokenTable>;
