import * as dotenv from "dotenv";
import app from "./app";
import { initializeDatabase } from "./config/db.config";

dotenv.config();

const PORT = process.env.PORT || 3000;

const initialize = async () => {
  try {
    await initializeDatabase();
    console.log("database init");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initialize();
