import { UploadRepository } from "../repository/upload.repository";
import { config } from "../config/env.config";
import { logger } from "../utils/logger";
import { UploadError } from "../utils/errors/upload.error";

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASQueryParameters,
} from "@azure/storage-blob";

export class UploadService {
  private uploadRepository: UploadRepository;
  private containerName: string;
  private blobServiceClient: BlobServiceClient;
  private accountKey: string;
  private accountName: string;

  constructor(uploadRepository: UploadRepository) {
    this.uploadRepository = uploadRepository;
    this.containerName = config.azure.containerName!;
    this.blobServiceClient = this.initializeAzureBlobStorageClient();
    this.accountKey = config.azure.storageKey!;
    this.accountName = config.azure.accountName!;
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

  async saveDocument() {}
}
