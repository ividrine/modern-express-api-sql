import { ColumnType, Generated, JSONColumnType } from "kysely";

export interface UserTable {
  id: Generated<number>;
  email: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  metadata: JSONColumnType<{
    login_at: string;
    ip: string | null;
    agent: string | null;
  }>;
}
