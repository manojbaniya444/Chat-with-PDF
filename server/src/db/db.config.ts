import pg from "pg";
import { tableSQLQuery } from "./db.schema";
import { config } from "../config/env.config";

export const pool = new pg.Pool({
  user: config.database.user,
  database: config.database.name,
  port: Number(config.database.port),
  host: config.database.host,
  password: config.database.password,
});

export const initializeDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    console.log("Extension pgcrypto")
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("vector")

    for (const query of Object.values(tableSQLQuery)) {
      await client.query(query);
    }

    console.log("Everything done")

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
