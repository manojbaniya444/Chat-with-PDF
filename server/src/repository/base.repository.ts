import { pool } from "../config/db.config";
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
}
