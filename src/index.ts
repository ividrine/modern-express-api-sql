import app from "./app.js";
import config from "./config/config.js";
import logger from "./config/logger.js";
import { initSql, closeSql } from "./infrastructure/pg.client.js";
import { initValkey, closeValkey } from "./infrastructure/valkey.client.js";

(async () => {
  await Promise.all([initSql(), initValkey()]);

  const server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  const shutdown = async () => {
    await Promise.allSettled([closeSql(), closeValkey()]);
    server.close();
  };

  const unexpectedErrorHandler = (error: Error) => {
    logger.error(error);
    shutdown();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
})();
