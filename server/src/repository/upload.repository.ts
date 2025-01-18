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
    email,
    user_id,
    file_name,
    file_size_bytes,
    pages
    ) VALUES ($1, $2, $3, $4, $5)
     RETURNING id
    `;
    try {
      const response = await this.executeQuery(query, [
        documentData.email,
        documentData.user_id,
        documentData.file_name,
        documentData.file_size_bytes,
        documentData.pages,
      ]);
      return response.length ? response[0] : null;
    } catch (error) {
      logger.error("Error inserting documenet to database", error);
      throw new DatabaseError("Error inserting document to database");
    }
  }

  async saveEmbeddings(
    textWithEmbeddings: {
      docs: string[];
      embeddings: number[][];
    },
    id: number
  ) {
    try {
      const insertQuery = `
      INSERT INTO document_embeddings (
      document_id,
      content,
      embedding
      )
      VALUES
      ($1, $2, $3)
      `;
      const queries = [];

      for (let i = 0; i < textWithEmbeddings.docs.length; i++) {
        const content = textWithEmbeddings.docs[i];
        const e = textWithEmbeddings.embeddings[i];
        const formattedEmbeddings = `[${e.join(", ")}]`;
        queries.push({
          query: insertQuery,
          values: [id, content, formattedEmbeddings],
        });
      }

      await this.executeTransaction(queries);

      return true;
    } catch (error) {
      logger.error("Error inserting embeddings to database", error);
      throw new DatabaseError("Error inserting embeddings to database");
    }
  }
}
