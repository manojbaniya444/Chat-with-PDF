import { config } from "../config/env.config";
import { logger } from "../utils/logger";

class LLMProvider {
  modelName: string;
  baseUrl: string;
  constructor(provider: "local") {
    switch (provider) {
      case "local":
        this.baseUrl = config.localModel.baseUrl!;
        this.modelName = config.localModel.providerName!;
    }
  }

  async getChatCompletion(question: string, chatContext: string) {
    const data = {
      model: this.modelName,
      messages: [
        {
          role: "system",
          content: `You are a friendly chatbot who helps user to read their pdf document using the context:
            ### Chat Context
            ${chatContext}
            `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    };
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // get the response
      const responseParse = await response.json();
      return responseParse?.choices[0].message.content;
    } catch (error) {
      logger.error("Error getting AI Response", error);
      throw new Error("Error getting AI Response");
    }
  }
}

export default LLMProvider;
