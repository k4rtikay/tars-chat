"use client";

import { useState, useRef, useEffect, SubmitEvent } from "react";
import { UserButton } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, User } from "lucide-react";
import { ChatUser } from "@/components/website/chat-context";

interface ChatViewProps {
    user: ChatUser;
}

export default function ChatView({ user }: ChatViewProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [message]);

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        // TODO: send message via convex mutation
        setMessage("");
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
                <div className="flex items-center justify-center h-full">
                    <p className="text-[13px] text-muted-foreground">
                        Say something nice to {user.name} ✨
                    </p>
                </div>
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
                        disabled={!message.trim()}
                        className="shrink-0 h-10 w-10 rounded-lg"
                    >
                        <SendHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </>
    );
}
