import { IDocument } from "../model/document.model";
import { DatabaseError } from "../utils/errors/db.error";
import { logger } from "../utils/logger";
import { BaseRepository } from "./base.repository";

export class UploadRepository extends BaseRepository {
  constructor() {
    super();
  }

  // TODO: Get the nearest embedding vector and its text content
  async getNearestDocumentBySimilarity(
    documentId: string,
    embedding: number[],
    k: number
  ) {
    const query = `
    WITH distances AS (
      SELECT
        document_id,
        content,
        embedding <-> ($1::float4[])::vector AS distance
      FROM
        document_embeddings
      WHERE document_id = $2
    )
    SELECT
      document_id,
      content
    FROM
      distances
    ORDER BY
      distance
    LIMIT $3;
    `;
    try {
      const response = await this.executeQuery(query, [
        embedding,
        documentId,
        k,
      ]);
      return response.length ? response : null;
    } catch (error) {
      logger.error("Error getting nearest documents");
      throw new DatabaseError("Error getting nearest document from pgvector");
    }
  }

  async getEmbeddingsOfDocument(documentId: string) {
    const query = `
    SELECT * FROM document_embeddings
    WHERE document_id = $1
    `;
    try {
      const response = await this.executeQuery(query, [documentId]);
      return response.length ? response : null;
    } catch (error) {
      logger.error("Error getting embedding data for document");
      throw new DatabaseError("Error getting embedding");
    }
  }

  async getDocuments() {
    const query = `
    SELECT * FROM documents
    ORDER BY created_at DESC
    `;
    try {
      const response = await this.executeQuery(query);
      return response.length ? response : null;
    } catch (error) {
      logger.error("Error fetching documents", error);
      throw new DatabaseError("Error fetching documents.");
    }
  }

  async getUserDocuments(email: string) {
    const query = `
    SELECT * FROM documents
    WHERE email = $1
    `;
    try {
      const response = await this.executeQuery(query, [email]);
      return response.length ? response : null;
    } catch (error) {
      logger.error("Error getting documents by user email");
      throw new DatabaseError("Error fetching documents by user id");
    }
  }

  async getDocumentById(id: string): Promise<IDocument | null> {
    const query = `
    SELECT * FROM documents
    WHERE id = $1
    `;
    try {
      const response = await this.executeQuery(query, [id]);
      return response.length ? response[0] : null;
    } catch (error) {
      logger.error("Error fetching single document.", error);
      throw new DatabaseError("Error fetching single document");
    }
  }

  async deletDocument(id: string) {
    const deleteEmbeddingQuery = `
    DELETE FROM document_embeddings
    WHERE document_id = $1
    `;
    const query = `
    DELETE FROM documents
    WHERE id = $1
    RETURNING id
    `;
    try {
      await this.executeQuery(deleteEmbeddingQuery, [id]);
      const response = await this.executeQuery(query, [id]);
      return response.length ? response[0] : null;
    } catch (error) {
      logger.error("Error deleting document");
      throw new DatabaseError("Error deleting document");
    }
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
