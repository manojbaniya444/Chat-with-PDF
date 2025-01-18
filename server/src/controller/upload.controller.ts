import { UploadService } from "../service/azureStorage.service";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { UploadError } from "../utils/errors/upload.error";
import { extractTextFromPdfBuffer } from "../lib/pdf.lib";
import { EmbeddingsProvider } from "../providers/embedding.provider";
import { CustomRequest } from "./auth.controller";
import { Document } from "../model/document.model";

//? To fix: Dependency Management
const embeddings = new EmbeddingsProvider("local");

export class UploadController {
  uploadService: UploadService;
  embeddingsProvider: EmbeddingsProvider;

  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
    this.embeddingsProvider = embeddings;
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
      // fetch the pdf from azure
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
      // generate embeddings
      const textWithEmbeddings = await this.embeddingsProvider.getEmbedding(
        pdfText.text
      );
  
      const documentData = new Document({
        id: req.user.id,
        email: req.user.email,
        pages: pdfText.numOfPages,
        file_size_bytes: sizeInBytes,
        file_name: blobName,
      });
      // store embeddings in the vector store
      await this.uploadService.saveDocument(textWithEmbeddings, documentData);
      // send the response
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
