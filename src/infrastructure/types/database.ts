import type { ColumnType, Generated, JSONColumnType } from "kysely";

export interface Database {
  user: User;
  token: Token;
}

export interface User {
  id: Generated<string>;
  email: string;
  password: ColumnType<string | undefined, string, string>;
  role: string;
  created_at: ColumnType<Date, string | undefined, never>;
  metadata: JSONColumnType<{
    login_at: string;
    ip: string | null;
    agent: string | null;
  }>;
}

export interface Token {
  id: Generated<string>;
  userId: string;
  token: string;
  type: string;
  expires: Date;
  revoked: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}
