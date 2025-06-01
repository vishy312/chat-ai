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
    const queryMessage: Message = {
      content: query,
      id: 0,
      role: "user",
      timestamp: new Date(),
    };

    addMessage(queryMessage);

    setQuery("");

    const formData = new FormData();
    formData.append("content", queryMessage.content);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    setLoading(true);

    axios
      .post("http://localhost:3000/api/message", formData)
      .then((response) => {
        setLoading(false);

        setMessages(response.data);
      });
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
      <SidebarInset className="h-screen no-scrollbar">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-col justify-end w-full p-6 gap-6">
          <MessagePanel
            className="w-4/5 mx-auto flex flex-col gap-3 overflow-scroll no-scrollbar"
            messages={messageList}
          />
          {loading && (
            <div className="w-4/5 mx-auto border break-words bg-gray-700 px-4 py-4 rounded-lg text-gray-200 flex flex-col">
              Thinking ...
            </div>
          )}
          <div className="input-box flex items-center gap-4 justify-center">
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
            />
            <Textarea
              className="w-3/5 max-h-40 break-words resize-none !text-lg no-scrollbar"
              placeholder="Ask anything..."
              value={query}
              onChange={(event) => handleOnChange(event.target.value)}
              onKeyUp={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.stopPropagation();
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
    </SidebarProvider>
  );
}
