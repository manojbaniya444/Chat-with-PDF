import ChatComponent from "@/components/chat/ChatComponent";
import DocumentList from "@/components/chat/DocumentList";
import FileUpload from "@/components/chat/FileUpload";
import React from "react";

const Chat = (): React.ReactNode => {
  return (
    <main className="flex h-dvh bg-slate-500 max-w-[1400px] mx-auto">
      {/* // left side bar */}
      <div className="w-[300px] bg-green-200 hidden md:flex flex-col gap-2">
        <FileUpload />
        <DocumentList />
      </div>

      {/* // main chat component */}
      <div className="flex-1 bg-yellow-100">
        <ChatComponent />
      </div>
    </main>
  );
};

export default Chat;
