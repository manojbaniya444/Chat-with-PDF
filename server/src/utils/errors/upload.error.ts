import { BaseError } from "./base.error";

export class UploadError extends BaseError {
  constructor(message: string) {
    super(message, 500, "UPLOAD_ERROR");
  }
}
