import { useState } from "react";
import { Upload, X } from "lucide-react";

interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

interface ProcessResponse {
  success: boolean;
  documentId: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const getPresignedUrl = async (
    fileName: string
  ): Promise<PresignedUrlResponse> => {
    try {
      const response = await fetch(
        "http://localhost:8080/upload/get-presigned-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName,
            fileType: "application/pdf",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PresignedUrlResponse = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to get upload URL");
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) return;

    setLoading(true);
    try {
      // Get pre-signed URL
      const { uploadUrl, key } = await getPresignedUrl(file.name);

      // Upload directly to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      //TODO: Trigger server processing
      console.log("File uploaded successfully");
      console.log(uploadResponse, key);

      setFile(null);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (): void => {
    setFile(null);
    setError("");
    setUploadProgress(0);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-600">
            {file ? file.name : "Drop PDF here or click to upload"}
          </span>
        </label>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm truncate">{file.name}</span>
            <button
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700"
              type="button"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

        {uploadProgress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="button"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
