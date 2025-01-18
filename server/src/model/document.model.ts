export interface IDocument {
  id: string;
  email: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number;
  pages: number;
  created_at: Date;
}

export class Document implements IDocument {
  id: string;
  email: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number;
  pages: number;
  created_at: Date;
  constructor(documentData: Partial<IDocument>) {
    (this.id = documentData.id!), (this.user_id = documentData.user_id!);
    this.file_name = documentData.file_name!;
    this.file_size_bytes = documentData.file_size_bytes!;
    this.pages = documentData.pages!;
    this.created_at = documentData.created_at || new Date();
    this.email = documentData.email!;
  }

  getFileSize() {
    const filesizeMegaBytes = this.file_size_bytes / 1024;
    return filesizeMegaBytes;
  }
}
