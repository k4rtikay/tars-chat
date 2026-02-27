"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { MessageSquare } from "lucide-react";

export default function Home() {
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

      {/* Main content */}
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

function Content() {
  const messages = useQuery(api.messages.list);
  return <div>Authenticated content: {messages?.length}</div>;
}