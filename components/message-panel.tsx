import { mockMessages } from "@/models/mock-messages";
// import { Role } from "../models/message";
import React from "react";

interface Props {
  className: string;
}

function MessagePanel({ className }: Props) {
  return (
    <div className={className}>
      {mockMessages.map((message, index) => {
        return (
          <div
            key={index}
            className={
              message.role === "user"
                ? "max-w-3/5 border ml-auto break-words bg-gray-700 px-4 py-2 rounded-lg text-white"
                : "w-full border break-words bg-gray-700 px-4 py-2 rounded-lg text-white"
            }
          >
            {message.content}
          </div>
        );
      })}
    </div>
  );
}

export default MessagePanel;
