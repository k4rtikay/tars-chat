"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { UserButton } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, User } from "lucide-react";
import { ChatUser, useChatContext } from "@/components/website/chat-context";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/format-time";

interface ChatViewProps {
  user: ChatUser;
}

export default function ChatView({ user }: ChatViewProps) {
  const { currentUserId } = useChatContext();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getOrCreateConversation = useMutation(api.conversations.getOrCreate);
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.conversations.markRead);
  const messages = useQuery(
    api.messages.list,
    conversationId ? { conversationId } : "skip",
  );

  // Get or create conversation when the selected user changes
  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;
    async function initConversation() {
      const id = await getOrCreateConversation({
        participantOne: currentUserId!,
        participantTwo: user._id,
      });
      if (!cancelled) {
        setConversationId(id);
      }
    }
    initConversation();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, user._id, getOrCreateConversation]);

  // Mark conversation as read when messages load or update
  useEffect(() => {
    if (conversationId && currentUserId && messages) {
      markRead({ conversationId, userId: currentUserId });
    }
  }, [conversationId, currentUserId, messages, markRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || !currentUserId) return;

    const body = message.trim();
    setMessage("");

    await sendMessage({
      conversationId,
      senderId: currentUserId,
      body,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold leading-tight">{user.name}</p>
          </div>
        </div>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[13px] text-muted-foreground">
              Say something nice to {user.name} ✨
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-accent text-foreground rounded-tl-sm"
                      }`}
                  >
                    {msg.body}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {formatMessageTime(msg._creationTime)}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="shrink-0 border-t border-border px-6 py-4"
      >
        <div className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="min-h-[40px] max-h-[160px] resize-none text-sm bg-accent/50 border-none focus-visible:ring-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || !conversationId}
            className="shrink-0 h-10 w-10 rounded-lg"
          >
            <SendHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </>
  );
}
