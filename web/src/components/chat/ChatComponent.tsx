import React, { useState } from "react";
import ChatMessages from "./ChatMessages";
import { Button } from "../ui/button";
import { useChatContext } from "@/context/ChatContext";
import { ChatContextType } from "@/types/chat.types";

type Props = {};

const ChatComponent = (props: Props) => {
  const [question, setQuestion] = useState<string>("");
  const { getChatResponse, loading } = useChatContext() as ChatContextType;

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (question === "") {
      return;
    }
    setQuestion("");
    getChatResponse(question);
  };
  return (
    <div className="flex flex-col h-full">
      {/* // chat message list */}
      <ChatMessages />

      {/* // send message form component */}
      <form
        className="flex gap-2 bg-slate-500 p-2 w-full"
        onSubmit={sendChatMessage}
      >
        <input
          type="text"
          placeholder="ask about your pdf"
          className="flex-1 w-full"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <Button type="submit" disabled={loading}>Send</Button>
      </form>
    </div>
  );
};

export default ChatComponent;
