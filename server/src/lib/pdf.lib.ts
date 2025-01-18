import { UploadError } from "../utils/errors/upload.error";
import { logger } from "../utils/logger";
import pdf from "pdf-parse";

async function extractTextFromPdfBuffer(pdfBuffer: Buffer): Promise<{
  numOfPages: number;
  text: string;
}> {
  try {
    const pdfData = await pdf(pdfBuffer);
    return {
      numOfPages: pdfData.numpages,
      text: pdfData.text,
    };
  } catch (error) {
    logger.error("Error extracting text from pdf", error);
    throw new UploadError("Error extracting text from pdf");
  }
}

export { extractTextFromPdfBuffer };
