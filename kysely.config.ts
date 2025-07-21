import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { db } from "./src/infrastructure/pg.client";

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "db/migrations",
    getMigrationPrefix: getKnexTimestampPrefix
  }
  // seeds: {
  //   seedFolder: "db/seeds",
  //   getSeedPrefix: getKnexTimestampPrefix
  // }
});
