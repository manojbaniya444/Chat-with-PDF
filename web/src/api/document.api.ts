import { AIResponseType } from "@/types/chat.types";

const BASE_URL = import.meta.env.VITE_APP_API_URL;

const getUserDocuments = async (): Promise<Document[] | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/document/user`, {
      credentials: "include",
    });
    if (response.status === 200) {
      const documents = await response.json();
      return documents.data;
    }
  } catch (error) {
    console.log("Error fetching the user documents", error);
  }
};

const getLLMResponse = async (
  documentId: string,
  question: string
): Promise<AIResponseType | undefined> => {
  try {
    const response = await fetch(`${BASE_URL}/document/chat`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ documentId, question }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const parseResponse = await response.json();
    console.log("Got AI Response: ", parseResponse);
    return parseResponse;
  } catch (error) {
    console.log("Error fetching the AI response: ", error);
  }
};

export { getUserDocuments, getLLMResponse };
