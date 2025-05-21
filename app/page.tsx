import { AppSidebar } from "@/components/app-sidebar";
import MessagePanel from "@/components/message-panel";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@radix-ui/react-separator";
import { ChevronUp } from "lucide-react";

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen no-scrollbar">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-col justify-end w-full p-6 gap-6">
          <MessagePanel className="w-4/5 mx-auto flex flex-col gap-3 overflow-scroll no-scrollbar" />
          <div className="input-box flex items-center gap-4 justify-center">
            <Textarea
              className="w-3/5 max-h-40 break-words resize-none !text-lg no-scrollbar"
              placeholder="Ask anything..."
            />
            <Button className="">
              <ChevronUp />
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
