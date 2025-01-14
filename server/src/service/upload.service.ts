import { UploadRepository } from "../repository/upload.repository";
import { config } from "../config/env.config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../utils/logger";
import { UploadError } from "../utils/errors/upload.error";

export class UploadService {
  uploadRepository: UploadRepository;
  s3Client: S3Client;

  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
    this.s3Client = this.initializeS3Client();
  }

  private initializeS3Client() {
    try {
      return new S3Client({
        region: config.aws.region || "ap-southeast-2",
        credentials: {
          accessKeyId: config.aws.ak!,
          secretAccessKey: config.aws.sk!,
        },
      });
    } catch (error) {
      logger.error("Error while connecting s3client", error);
      throw new Error("Error connecting s3");
    }
  }

  async generatePresignedUrl(fileName: string, fileType: string) {
    const key = `document-pdf/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
      ContentType: "application/pdf",
    });

    try {
      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      });
      return { uploadUrl, key };
    } catch (error) {
      logger.error("Error while getting presigned url: ", error);
      throw new UploadError("Error while uploading document");
    }
  }

  async saveDocument() {}
}
