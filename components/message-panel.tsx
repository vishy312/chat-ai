import { Message } from "@/models/message";
// import { messages } from "@/models/mock-messages";
// import { Role } from "../models/message";
import React from "react";

interface Props {
  className: string;
  messages: Message[];
}

function MessagePanel({ className, messages }: Props) {
  const intlDateObj = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className={className}>
      {messages.map((message: Message, index: number) => {
        return (
          <div
            key={index}
            className={
              message.role === "user"
                ? "max-w-3/5 border ml-auto break-words bg-gray-700 px-4 py-2 rounded-lg text-white flex flex-col"
                : "w-full border break-words bg-gray-700 px-4 py-2 rounded-lg text-white flex flex-col"
            }
          >
            {message.content}
            <span className="self-end w-fit text-xs text-gray-300">
              {intlDateObj.format(message.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default MessagePanel;
