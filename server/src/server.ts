import * as dotenv from "dotenv";
import app from "./app";
import { initializeDatabase } from "./db/db.config";
import { logger } from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 3000;

const initialize = async () => {
  try {
    // await initializeDatabase();
    logger.info("database init");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Error starting server: ", error);
    process.exit(1);
  }
};

initialize();
