import FileUpload from "@/components/chat/FileUpload";
import React from "react";

const Chat = (): React.ReactNode => {
  return (
    <main>
      <h1>Chat with your pdf here.</h1>
      <p>Upload files and start chatting</p>
      <FileUpload />
    </main>
  );
};

export default Chat;
