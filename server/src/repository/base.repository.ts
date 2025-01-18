import { pool } from "../db/db.config";
import { DatabaseError } from "../utils/errors/db.error";

export class BaseRepository {
  constructor() {}

  async executeQuery(query: string, values: any[] = []) {
    // execute the query and send the result
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.log("Error querying database", error);
      throw new DatabaseError("Error querying database");
    }
  }

  async executeTransaction(queries: { query: string; values: any[] }[]) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (const { query, values } of queries) {
        await client.query(query, values);
      }
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("Error executing transaction", error);
      throw new DatabaseError("Error executing transaction");
    } finally {
      client.release();
    }
  }
}
