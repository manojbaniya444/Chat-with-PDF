import pg from "pg";
import { tableSQLQuery } from "./db.schema";
import { config } from "../config/env.config";

export const pool = new pg.Pool({
  connectionString: config.database.connectionString,
});

export const initializeDatabase = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
    console.log("Extension pgcrypto");
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");

    for (const query of Object.values(tableSQLQuery)) {
      await client.query(query);
    }

    await client.query(
      "CREATE INDEX ON document_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)"
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
