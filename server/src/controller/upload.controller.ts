import { UploadService } from "../service/azureStorage.service";

import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { UploadError } from "../utils/errors/upload.error";

export class UploadController {
  uploadService: UploadService;

  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
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
        token: sas.token
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
}
