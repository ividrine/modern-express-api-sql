import Valkey from "iovalkey";
import config from "../config/config.js";
import logger from "../config/logger.js";

const valkey = new Valkey.default(config.valkey_url);

valkey.on("error", (err) => {
  logger.error("[VALKEY] client error:", err);
});

export async function initValkey(): Promise<void> {
  await valkey.ping();
}

export async function closeValkey(): Promise<void> {
  await valkey.quit();
}

export default valkey;
