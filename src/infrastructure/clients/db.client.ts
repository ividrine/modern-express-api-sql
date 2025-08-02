import { Pool } from "pg";
import config from "../../config/config.js";
import { Kysely, PostgresDialect } from "kysely";
import logger from "../../config/logger.js";
import type { DB } from "../types/db.d.js";

const pool = new Pool({
  connectionString: config.db_url
}).on("error", (err) => {
  logger.error("[PG] pool error:", err);
});

const dialect = new PostgresDialect({ pool });
export const db = new Kysely<DB>({ dialect });

export const initSql = async () => {
  await pool.query("select 1");
};

export const closeSql = async () => {
  await db.destroy();
};
