import { getLLMResponse, getUserDocuments } from "@/api/document.api";
import { ChatContextType, Document, MessageType } from "@/types/chat.types";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider = ({ children }: { children: any }) => {
  const [userDocuments, setUserDocuments] = useState<Document[] | null>(null);
  const [aiResponse, setAIResponse] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<MessageType[]>([
    {
      sender: "AI",
      message: "Ask question about this document.",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(
    null
  );

  // get all the user documents all
  useEffect(() => {
    const fetchDocuments = async () => {
      const documents: Document[] | any = await getUserDocuments();
      if (documents) {
        setUserDocuments(documents);
      }
    };
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (userDocuments && userDocuments.length > 0) {
      setCurrentDocumentId(userDocuments[userDocuments.length - 1].id);
    }
  });

  // for fetching all the chat messages of the documentid
  useEffect(() => {
    if (aiResponse === "") return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: "AI",
        message: aiResponse,
      },
    ]);
  }, [aiResponse]);

  console.log("Document: ", currentDocumentId);

  // get the AI response on user chat message
  const getChatResponse = async (question: string) => {
    try {
      setLoading(true);
      if (currentDocumentId) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "user",
            message: question,
          },
        ]);
        const aiResponse = await getLLMResponse(currentDocumentId, question);
        setAIResponse(aiResponse?.data ? aiResponse.data : "");
        setLoading(false);
      } else {
        alert("No document selected to chat");
      }
    } catch (error) {
      console.log("Error getting ai response: ", error);
      setLoading(false);
    }
  };

  console.log("User Documents", userDocuments);
  return (
    <ChatContext.Provider
      value={{ userDocuments, getChatResponse, chatMessages, loading }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};
