import { IDocument } from "../model/document.model";
import { DatabaseError } from "../utils/errors/db.error";
import { logger } from "../utils/logger";
import { BaseRepository } from "./base.repository";

export class UploadRepository extends BaseRepository {
  constructor() {
    super();
  }

  async saveUploadedDocument(documentData: Partial<IDocument>) {
    const query = `
    INSERT INTO documents (
    user_id,
    file_name,
    file_size_bytes,
    s3_key,
    pages,
    status
    ) VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id
    `;
    try {
      const response = await this.executeQuery(query, [
        documentData.user_id,
        documentData.file_name,
        documentData.file_size_bytes,
        documentData.s3_key,
        documentData.pages,
        documentData.status,
      ]);
      return response.length ? response[0] : null
    } catch (error) {
      logger.error("Error inserting documenet to database", error);
      throw new DatabaseError("Error inserting document to database");
    }
  }
}
