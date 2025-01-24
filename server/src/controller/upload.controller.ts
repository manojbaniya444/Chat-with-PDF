import { UploadService } from "../service/azureStorage.service";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { UploadError } from "../utils/errors/upload.error";
import { extractTextFromPdfBuffer } from "../lib/pdf.lib";
import { EmbeddingsProvider } from "../providers/embedding.provider";
import { CustomRequest } from "./auth.controller";
import { Document, IDocument } from "../model/document.model";

//? To fix: Dependency Management
const embeddings = new EmbeddingsProvider("local");

export class UploadController {
  uploadService: UploadService;
  embeddingsProvider: EmbeddingsProvider;

  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
    this.embeddingsProvider = embeddings;
  }

  async getDocumentEmbeddings(req: Request, res: Response): Promise<any> {
    const documentId = req.body.documentId;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Error fetching document embeddings",
      });
    }
    try {
      const embeddings = await this.uploadService.getDocumentEmbeddings(
        documentId
      );
      return res.status(200).json({
        success: true,
        message: "fetching embeddings for document success",
        data: embeddings,
      });
    } catch (error) {
      logger.error("Error fetching document embedding");
      return res.status(400).json({
        success: false,
        message: "Error fetching document embedding",
      });
    }
  }

  async getSimilarDocuments(req: Request, res: Response): Promise<any> {
    const { documentId, text, k } = req.body;

    if (!documentId || !text || !k) {
      return res.status(404).json({
        success: false,
        message:
          "Please provide documentid, text and number of documents to fetch",
      });
    }

    try {
      const embedding = await this.embeddingsProvider.embedText(text);
      const topKDocuments = await this.uploadService.getSimilarDocuments(
        documentId,
        embedding,
        k
      );
      return res.status(200).json({
        success: true,
        message: "Fetch top k documents success",
        data: topKDocuments,
      });
    } catch (error) {
      logger.error("Error getting top k document");
      return res.status(400).json({
        success: false,
        message: "Error getting topk documents",
      });
    }
  }

  async getDocuments(req: Request, res: Response): Promise<any> {
    try {
      const documents = await this.uploadService.getDocuments();

      if (!documents) {
        return res.status(404).json({
          success: false,
          message: "Documents not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fetch all documents success",
        data: documents,
      });
    } catch (error) {
      logger.error("Error fetching all document");
      return res.status(400).json({
        success: false,
        message: "Error fetching all document data",
      });
    }
  }

  async getUserDocuments(req: CustomRequest, res: Response) {
    const email = req.user?.email || req.params.email;

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "No user detail to fetch user documents",
      });
    }

    try {
      const documents = await this.uploadService.getDocumentByUserEmail(email);
      return res.status(200).json({
        success: true,
        message: "Fetch user documents success",
        data: documents,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Error fetching user documents",
      });
    }
  }

  async getDocumentById(req: Request, res: Response): Promise<any> {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please give id for document",
      });
    }

    try {
      const document = await this.uploadService.getDocumentById(id);
      return res.status(200).json({
        success: true,
        message: "Fetch single document by id success",
        data: document,
      });
    } catch (error) {
      logger.error("Error fetching document with document id");
      return res.status(400).json({
        success: false,
        message: "Error fetching document by id",
      });
    }
  }

  async deleteDocument(req: Request, res: Response): Promise<any> {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide the id of the documents you want to delete",
      });
    }

    try {
      const deletedDocument = await this.uploadService.deleteDocument(id);
      return res.status(200).json({
        success: true,
        message: "Document delted successful",
        data: deletedDocument,
      });
    } catch (error) {
      logger.error("Error deleting document");
      return res.status(400).json({
        success: false,
        message: "Error deleting document",
      });
    }
  }

  async getSasToken(req: Request, res: Response): Promise<any> {
    let filename;
    try {
      const { fileName, fileType } = req.body;

      if (!fileName || !fileType) {
        return res.status(400).json({
          success: false,
          message:
            "please provide filename and filetype to get the presigned url",
        });
      }
      filename = fileName;

      const sas = await this.uploadService.generateSasToken(fileName);

      return res.json({
        uri: sas.baseUri,
        token: sas.token,
        uniqueFileName: fileName,
      });
    } catch (error) {
      logger.error(
        `Error generating sas token in azure client: ${filename}`,
        error
      );

      if (error instanceof UploadError) {
        return res
          .status(500)
          .json({ success: false, message: error.message, code: error.code });
      }

      return res.status(500).json({
        success: false,
        message: "Unknown error occured generating sas token",
      });
    }
  }

  async processPdf(req: CustomRequest, res: Response) {
    try {
      const { blobName } = req.body;

      if (!blobName) {
        return res.status(400).json({
          success: false,
          message: "No blob name provided error while processing pdf",
        });
      }

      const { pdfBuffer, sizeInBytes } =
        await this.uploadService.fetchPdfFromAzure(blobName);

      const pdfText = await extractTextFromPdfBuffer(pdfBuffer);

      const textWithEmbeddings = await this.embeddingsProvider.getEmbedding(
        pdfText.text
      );

      const documentData = new Document({
        user_id: req.user.id,
        email: req.user.email,
        pages: pdfText.numOfPages,
        file_size_bytes: sizeInBytes,
        file_name: blobName,
      });
      await this.uploadService.saveDocument(textWithEmbeddings, documentData);

      return res.status(200).json({
        success: true,
        message: "PDF loaded successfully now you can chat with it.",
        text: pdfText,
      });
    } catch (error) {
      logger.error("Error while processing pdf", error);

      if (error instanceof UploadError) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Internal unknown error while processing your pdf",
        });
      }
    }
  }
}
