"use client";

import { AppSidebar } from "@/components/app-sidebar";
import MessagePanel from "@/components/message-panel";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/models/message";
import { useMessageStore } from "@/store/store";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { ChevronUp, PlusCircleIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

export default function Home() {
  const messageList = useMessageStore((state) => state.messages);
  const addMessage = useMessageStore((state) => state.addMessage);
  const setMessages = useMessageStore((state) => state.setMessages);

  const [messageStream, setMessageStream] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const [query, setQuery] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const getMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/message");
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const handleOnChange = (q: string) => {
    setQuery(q);
  };

  const handleOnSend = async () => {
    if (query === "") return;
    const queryMessage: Message = {
      content: query,
      id: 0,
      role: "user",
      timestamp: new Date(),
    };

    addMessage(queryMessage);

    setQuery("");

    const formData = new FormData();
    formData.append("content", query);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    setLoading(true);

    const res = await fetch("http://localhost:3000/api/message", {
      body: formData,
      method: "POST",
    });

    if (!res.body) {
      console.error("Response body is null");
      return;
    }

    const reader = res?.body?.getReader();
    const decoder = new TextDecoder();
    if (!decoder) return;

    let buffer = "";

    setStreaming(true);
    while (true) {
      const { value, done } = await reader?.read();
      if (done) {
        setStreaming(false);
        break;
      }

      buffer += decoder.decode(value);
      const lines = buffer.split("\n\n");
      buffer = lines?.pop() || "";

      for (const line of lines) {
        if (line.startsWith("event: allMessages")) {
          const allMessages = JSON.parse(line.split("data: ")[1] || "");
          setMessages(allMessages);
          // console.log("📦 allMessages:", allMessages);
        } else if (line.startsWith("data: ")) {
          const token = line.replace("data: ", "");

          // send this token to MessagePanel component
          setMessageStream(token);
        } else {
        }
      }
    }

    setLoading(false);

    // axios
    //   .post("http://localhost:3000/api/message", formData, {
    //     responseType: "stream",
    //   })
    //   .then((response) => {
    //     setMessages(response.data);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //     formData.delete("file");
    //     setSelectedFile(null);
    //   });
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileUpload = () => {
    fileRef.current!.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <div className="h-screen bg-red "> */}
      <SidebarInset className="h-screen flex flex-col scroll-smooth">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-col justify-end w-full h-[calc(100vh-4rem)] p-6 gap-6">
          <MessagePanel
            className="w-4/5 mx-auto flex flex-col gap-3 overflow-y-scroll no-scrollbar scroll-smooth"
            messages={messageList}
            messageStream={messageStream}
            streaming={streaming}
          />
          {loading && (
            <div className="w-4/5 mx-auto border break-words bg-gray-700 px-4 py-4 rounded-lg text-gray-200 flex flex-col">
              Thinking ...
            </div>
          )}
          {selectedFile && (
            <small className="w-3/5 mx-auto text-blue-700">
              {selectedFile.name}
            </small>
          )}
          <div
            ref={bottomRef}
            className="input-box flex items-center gap-4 justify-center"
          >
            <PlusCircleIcon
              className="cursor-pointer"
              onClick={handleFileUpload}
            />
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileRef}
              onChange={handleFileChange}
              accept=".pdf"
              max={1}
            />
            <Textarea
              className="w-3/5 max-h-40 break-words resize-none !text-lg no-scrollbar"
              placeholder="Ask anything..."
              value={query}
              onChange={(event) => handleOnChange(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.stopPropagation();
                  const inputQuery = event.currentTarget.value.trim();
                  if (inputQuery === "") return;
                  handleOnSend();
                }
              }}
            />
            <Button className="cursor-pointer" onClick={handleOnSend}>
              <ChevronUp />
            </Button>
          </div>
        </div>
      </SidebarInset>
      {/* </div> */}
    </SidebarProvider>
  );
}
