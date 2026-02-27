"use client";

import { MessageSquare } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useChatContext } from "@/components/website/chat-context";
import ChatView from "@/components/website/chat-view";

export default function Home() {
  const { selectedUser } = useChatContext();

  if (selectedUser) {
    return <ChatView user={selectedUser} />;
  }

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </header>

      {/* Empty state */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent">
            <MessageSquare className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">
              Select a conversation
            </p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              Pick someone from the sidebar and start chatting ✨
            </p>
          </div>
        </div>
      </div>
    </>
  );
}