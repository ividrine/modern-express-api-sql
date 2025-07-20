import { Pool } from "pg";
import config from "../config/config.js";
import { Kysely, PostgresDialect } from "kysely";
import logger from "../config/logger.js";
import type { Database } from "../types/database.js";

const pool = new Pool({
  database: "test",
  connectionString: config.db_url,
  max: 10
});

pool.on("error", (err) => {
  logger.error("[PG] pool error:", err);
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<Database>({ dialect });

export const initSql = async () => {
  await pool.query("select 1");
};

export const closeSql = async () => {
  await db.destroy();
};
