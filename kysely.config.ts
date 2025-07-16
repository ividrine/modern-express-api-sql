import { Pool } from "pg";
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";

export default defineConfig({
  dialect: "pg",
  dialectConfig: {
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
      idleTimeoutMillis: 60_000,
      max: 10,
      ssl: process.env.NODE_ENV === "production"
    })
  },
  migrations: {
    migrationFolder: "db/migrations",
    getMigrationPrefix: getKnexTimestampPrefix
  },
  plugins: [],
  seeds: {
    seedFolder: "db/seeds",
    getSeedPrefix: getKnexTimestampPrefix
  }
});
