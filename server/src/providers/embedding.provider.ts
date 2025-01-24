import { config } from "../config/env.config";
import { logger } from "../utils/logger";
import { LocalEmbeddingResponseType } from "../types";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class EmbeddingsProvider {
  private providerName: string;
  private baseUrl: string;
  private textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 10,
  });

  constructor(provider: string) {
    switch (provider) {
      case "local":
        this.providerName = config.embeddings.providerName!;
        this.baseUrl = config.localModel.baseUrl!;
        break;

      default:
        this.providerName = config.embeddings.providerName!;
        this.baseUrl = config.localModel.baseUrl!;
        break;
    }
  }

  async embedText(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: this.providerName,
          input: text,
        }),
      });
      const embedding: LocalEmbeddingResponseType = await response.json();
      const emb = embedding?.data[0].embedding;
      return emb;
    } catch (error) {
      logger.error("Error fetching embeddings from embedding server", error);
      throw new Error("Error fetching embedding from its server");
    }
  }

  async getEmbedding(text: string): Promise<{
    docs: string[];
    embeddings: number[][];
  }> {
    try {
      const documents = await this.textSplitter.createDocuments([text]);
      logger.info(`Got ${documents.length} documents to embedding`);
      const inputs = documents.map((doc) => doc.pageContent);
      const embeddingData = {
        model: this.providerName,
        input: inputs,
      };
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(embeddingData),
      });
      const embedding: LocalEmbeddingResponseType = await response.json();

      const embeddings = embedding.data.map((emb) => emb.embedding);
      return {
        docs: inputs,
        embeddings: embeddings,
      };
    } catch (error) {
      logger.error("Error fetching embeddings", error);
      throw new Error(`Error fetching embedding from ${this.providerName}`);
    }
  }
}
