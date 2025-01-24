import express from "express";
import { UploadRepository } from "../repository/upload.repository";
import { UploadService } from "../service/azureStorage.service";
import { UploadController } from "../controller/upload.controller";

const router = express.Router();

const uploadRepository = new UploadRepository();
const uploadService = new UploadService(uploadRepository);
const uploadController = new UploadController(uploadService);

router.post(
  "/getSasToken",
  uploadController.getSasToken.bind(uploadController)
);
router.get("/", uploadController.getDocuments.bind(uploadController)); // fetch all documents just for testing not for the clients to get all list of data.
router.post("/processPdf", uploadController.processPdf.bind(uploadController));
router.get("/user/:email", uploadController.getUserDocuments.bind(uploadController));
router.get(
  "/embedding",
  uploadController.getDocumentEmbeddings.bind(uploadController)
);
router.post(
  "/getTopKDocuments",
  uploadController.getSimilarDocuments.bind(uploadController)
);
router.get("/:id", uploadController.getDocumentById.bind(uploadController));
router.delete("/:id", uploadController.deleteDocument.bind(uploadController));

export default router;
