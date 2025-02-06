import { useChatContext } from "@/context/ChatContext";
import { ChatContextType } from "@/types/chat.types";
import React, { useEffect, useRef } from "react";

type Props = {};

const ChatMessages = (props: Props) => {
  const { chatMessages, loading } = useChatContext() as ChatContextType;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  console.log(chatMessages);
  return (
    <div
      className="bg-cyan-500 py-8 px-4 w-full flex-1 flex flex-col gap-2 overflow-y-auto scroll-auto"
      ref={chatContainerRef}
    >
      {chatMessages.map((msg, index) => {
        return (
          <div
            key={index}
            className={`${
              msg.sender === "AI"
                ? "bg-slate-200 text-black self-start"
                : " bg-blue-500 text-white self-end"
            } p-3 max-w-[80%] rounded-lg`}
          >
            <p className="whitespace-pre-wrap">{msg.message}</p>
          </div>
        );
      })}

      {/* // loading animation */}
      {loading && (
        <div className="flex absolute bottom-12 p-2">
          <div className="animate-bounce bg-blue-500 h-4 w-4 rounded-full mx-1"></div>
          <div
            className="animate-bounce bg-blue-500 h-4 w-4 rounded-full mx-1"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="animate-bounce bg-blue-500 h-4 w-4 rounded-full mx-1"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
