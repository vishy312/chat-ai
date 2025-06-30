import { Message } from "@/models/message";
import React from "react";
import Markdown from "react-markdown";
import remarkGFM from "remark-gfm";

interface Props {
  className: string;
  messages: Message[];
  streaming: boolean;
  messageStream: string;
}

function MessagePanel({
  className,
  messages,
  streaming,
  messageStream,
}: Props) {
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
                ? "max-w-3/5 border ml-auto break-words bg-gray-900 px-4 py-2 rounded-lg text-white flex flex-col"
                : "max-w-full border break-words bg-gray-700 px-4 py-2 rounded-lg text-white flex flex-col"
            }
          >
            {<Markdown remarkPlugins={[remarkGFM]}>{message.content}</Markdown>}
            <span className="self-end w-fit text-xs text-gray-300">
              {intlDateObj.format(new Date(message.timestamp))}
            </span>
          </div>
        );
      })}

      {streaming && (
        <div
          className={
            "w-full border break-words bg-gray-700 px-4 py-2 rounded-lg text-white flex flex-col"
          }
        >
          {<Markdown remarkPlugins={[remarkGFM]}>{messageStream}</Markdown>}
        </div>
      )}
    </div>
  );
}

export default MessagePanel;
