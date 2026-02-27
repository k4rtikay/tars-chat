"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, User, ArrowLeft } from "lucide-react";
import { ChatUser, useChatContext } from "@/components/website/chat-context";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import MessageList from "@/components/website/message-list";
import TypingIndicator from "@/components/website/typing-indicator";
import { isOnline } from "@/lib/format-time";

interface ChatViewProps {
  user: ChatUser;
}

const TYPING_THROTTLE = 2000; // Fire setTyping at most every 2 seconds

export default function ChatView({ user }: ChatViewProps) {
  const { currentUserId, setSelectedUser } = useChatContext();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastTypingRef = useRef(0);

  const getOrCreateConversation = useMutation(api.conversations.getOrCreate);
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.conversations.markRead);
  const setTyping = useMutation(api.typing.setTyping);
  const clearTyping = useMutation(api.typing.clearTyping);
  const messages = useQuery(
    api.messages.list,
    conversationId ? { conversationId } : "skip",
  );
  const otherUser = useQuery(api.users.getById, { userId: user._id });
  const online = isOnline(otherUser?.lastSeen);

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

  // Throttled typing indicator
  const handleTyping = useCallback(() => {
    if (!conversationId || !currentUserId) return;

    const now = Date.now();
    if (now - lastTypingRef.current > TYPING_THROTTLE) {
      lastTypingRef.current = now;
      setTyping({ conversationId, userId: currentUserId });
    }
  }, [conversationId, currentUserId, setTyping]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || !currentUserId) return;

    const body = message.trim();
    setMessage("");

    // Clear typing indicator and send message
    await Promise.all([
      clearTyping({ conversationId, userId: currentUserId }),
      sendMessage({ conversationId, senderId: currentUserId, body }),
    ]);
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
      <header className="flex items-center px-4 md:px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
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
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
              <span className="text-[11px] text-muted-foreground">
                {online ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        userName={user.name}
        messagesEndRef={messagesEndRef}
      />

      
      <TypingIndicator
        conversationId={conversationId}
        currentUserId={currentUserId}
      />
      
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
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
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
