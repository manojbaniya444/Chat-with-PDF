import express from "express";
import { UploadRepository } from "../repository/upload.repository";
import { UploadService } from "../service/azureStorage.service";
import { UploadController } from "../controller/upload.controller";

const router = express.Router();

const uploadRepository = new UploadRepository();
const uploadService = new UploadService(uploadRepository);
const uploadController = new UploadController(uploadService);

// get presigned url
router.post(
  "/getSasToken",
  uploadController.getSasToken.bind(uploadController)
);

export default router;
