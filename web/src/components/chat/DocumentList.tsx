import { useChatContext } from "@/context/ChatContext";
import { ChatContextType } from "@/types/chat.types";
import React from "react";

type Props = {};

const DocumentList = (props: Props) => {
  const { userDocuments } = useChatContext() as ChatContextType;
  console.log("User Documents", userDocuments);
  return (
    <div className="bg-blue-400 p-4 flex-1 overflow-y-auto w-full">
      {userDocuments?.map((doc) => {
        return <div key={doc.id} className="bg-slate-500 p-2 text-white">{doc.file_name}</div>;
      })}
    </div>
  );
};

export default DocumentList;
