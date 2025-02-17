import { UploadRepository } from "../repository/upload.repository";
import { config } from "../config/env.config";
import { logger } from "../utils/logger";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { UploadError } from "../utils/errors/upload.error";
import { IDocument } from "../model/document.model";
import LLMProvider from "../providers/llm.provider";

const llmProvider = new LLMProvider("local");

export class UploadService {
  private uploadRepository: UploadRepository;
  private containerName: string;
  private blobServiceClient: BlobServiceClient;
  private accountKey: string;
  private accountName: string;
  private llmProvider: LLMProvider;

  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
    this.containerName = config.azure.containerName!;
    this.blobServiceClient = this.initializeAzureBlobStorageClient();
    this.accountKey = config.azure.storageKey!;
    this.accountName = config.azure.accountName!;
    this.llmProvider = llmProvider;
  }

  private initializeAzureBlobStorageClient() {
    try {
      return BlobServiceClient.fromConnectionString(
        config.azure.storageConnection!
      );
    } catch (error) {
      logger.error("Error while connecting azure blob storage", error);
      throw new Error("Error connecting azure blob storage");
    }
  }

  async getAIResponse(
    question: string,
    retrievedDocuments: any[]
  ): Promise<any> {
    let context = "";

    retrievedDocuments.forEach((doc) => {
      context += doc.content;
    });

    try {
      const response = await this.llmProvider.getChatCompletion(
        question,
        context
      );
      return response;
    } catch (error) {
      throw new Error("Error providing llm response service");
    }
  }

  async fetchPdfFromAzure(
    blobName: string,
    containerName?: string
  ): Promise<{
    pdfBuffer: Buffer;
    sizeInBytes: number;
  }> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName
      );
      const blobClient = containerClient.getBlobClient(blobName);

      const downloadBlockBlobResponse = await blobClient.download();
      const chunks: Buffer[] = [];
      const contentLength = downloadBlockBlobResponse.contentLength;

      for await (const chunk of downloadBlockBlobResponse.readableStreamBody!) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      return { pdfBuffer: Buffer.concat(chunks), sizeInBytes: contentLength! };
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error downloading pdf Buffer from Azure storage", error);
        throw new UploadError(
          `Error downloading pdf from azure ${error.message}`
        );
      } else {
        logger.error(
          "Unknown error while downloading pdf Buffer from Azure storage server"
        );
        throw new UploadError(
          "Unknown Error while downloading pdf from server"
        );
      }
    }
  }

  async generateSasToken(blobName: string): Promise<{
    token: string;
    baseUri: string;
  }> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    const blobClient = containerClient.getBlobClient(blobName);
    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    // 30 minutes token validation
    expiresOn.setMinutes(startsOn.getMinutes() + 30);
    // read, add, create, write
    const permissions = BlobSASPermissions.parse("racw");
    // sas token
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName: this.containerName,
        blobName: blobName,
        permissions: permissions,
        startsOn: startsOn,
        expiresOn: expiresOn,
      },
      new StorageSharedKeyCredential(this.accountName, this.accountKey)
    ).toString();

    const sasUri = sasToken[0] === "?" ? sasToken : `?${sasToken}`;

    return {
      token: sasUri,
      baseUri: blobClient.url,
    };
  }

  async getSimilarDocuments(
    documentId: string,
    embedding: number[],
    k: number
  ) {
    const topKSimilarDocuments =
      await this.uploadRepository.getNearestDocumentBySimilarity(
        documentId,
        embedding,
        k
      );
    return topKSimilarDocuments;
  }
  async getDocumentEmbeddings(documentId: string) {
    const embeddings = await this.uploadRepository.getEmbeddingsOfDocument(
      documentId
    );
    return embeddings;
  }

  async getDocuments() {
    const documents = await this.uploadRepository.getDocuments();
    return documents;
  }

  async getDocumentByUserEmail(email: string) {
    const documents = await this.uploadRepository.getUserDocuments(email);
    return documents;
  }

  async getDocumentById(id: string) {
    const document = await this.uploadRepository.getDocumentById(id);
    return document;
  }

  async deleteDocument(id: string) {
    const deletedDocument = await this.uploadRepository.deletDocument(id);
    return deletedDocument;
  }

  async saveDocument(
    embeddingResponse: {
      docs: string[];
      embeddings: number[][];
    },
    documentData: Partial<IDocument>
  ) {
    const document = await this.uploadRepository.saveUploadedDocument(
      documentData
    );
    console.log("Document saved", document);

    const result = await this.uploadRepository.saveEmbeddings(
      embeddingResponse,
      document.id
    );
    return result ? result : false;
  }
}
