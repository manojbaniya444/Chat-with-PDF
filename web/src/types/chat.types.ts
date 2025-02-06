export type Document = {
  id: string;
  email: string;
  user_id: string;
  file_name: string;
  file_size_bytes: number;
  pages?: number;
  created_at: string;
};

export type ChatContextType = {
  userDocuments: Document[] | null;
  getChatResponse: (question: string) => any;
  chatMessages: MessageType[];
  loading: boolean;
};

export type AIResponseType = {
  data?: string;
  message: string;
  success: boolean;
};

export type MessageType = {
  sender: "AI" | "user";
  message: string;
};
