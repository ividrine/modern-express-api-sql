import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";

export default defineConfig({
  dialect: "pg",
  dialectConfig: {
    pool: new Pool({ connectionString: process.env.DATABASE_URL })
  },
  migrations: {
    migrationFolder: "db/migrations",
    getMigrationPrefix: getKnexTimestampPrefix
  }

  // seeds: {
  //   seedFolder: "kysely/seeds",
  //   getSeedPrefix: getKnexTimestampPrefix
  // }
});
