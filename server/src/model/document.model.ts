export interface IDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number;
  s3_key: string;
  pages: string;
  status: string;
  error?: string;
  created_at: Date;
}

export class Document implements IDocument {
  id: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number;
  s3_key: string;
  pages: string;
  status: "pending" | "done";
  error?: string;
  created_at: Date;
  constructor(documentData: Partial<IDocument>) {
    (this.id = documentData.id!), (this.user_id = documentData.user_id!);
    this.file_name = documentData.file_name!;
    this.file_size_bytes = documentData.file_size_bytes!;
    this.s3_key = documentData.s3_key!;
    this.pages = documentData.pages!;
    this.status = "pending";
    this.error = documentData.error;
    this.created_at = documentData.created_at || new Date();
  }

  getFileSize() {
    const filesizeMegaBytes = this.file_size_bytes / 1024;
    return filesizeMegaBytes;
  }
}
