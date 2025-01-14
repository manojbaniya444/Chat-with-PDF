import { UploadService } from "../service/upload.service";

import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { UploadError } from "../utils/errors/upload.error";

export class UploadController {
  uploadService: UploadService;

  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
  }

  async getPresignedUrl(
    req: Request,
    res: Response
  ): Promise<any> {
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

      const uploadData = await this.uploadService.generatePresignedUrl(
        fileName,
        fileType
      );

      return res.json({
        uploadUrl: uploadData.uploadUrl,
        key: uploadData.key,
      });
    } catch (error) {
      logger.error(
        `Error generating pre-signed URL for file: ${filename}`,
        error
      );

      if (error instanceof UploadError) {
        return res
          .status(500)
          .json({ success: false, message: error.message, code: error.code });
      }

      return res.status(500).json({
        success: false,
        message: "Unknown error occured while generating presigned url",
      });
    }
  }
}
