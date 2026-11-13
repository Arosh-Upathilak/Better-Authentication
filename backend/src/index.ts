import app from "./app";
import { config } from "./config/env";
import logger from "./config/logger";

async function start() {
  app.listen(config.PORT, () => {
    logger.info(`Server started at http://localhost:${config.PORT}`);
  });
}

start().catch((error: unknown) => {
  logger.error({ error }, "Failed to start server");
  process.exit(0);
});
