"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Id } from "@/../convex/_generated/dataModel";
import { formatMessageTime } from "@/lib/format-time";

interface Message {
    _id: Id<"messages">;
    _creationTime: number;
    senderId: Id<"users">;
    body: string;
}

interface MessageListProps {
    messages: Message[] | undefined;
    currentUserId: Id<"users"> | null;
    userName: string;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({
    messages,
    currentUserId,
    userName,
    messagesEndRef,
}: MessageListProps) {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const distanceFromBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight;
        setShowScrollButton(distanceFromBottom > container.clientHeight);
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messagesEndRef]);

    return (
        <div className="relative flex-1 overflow-hidden">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto px-6 py-6"
            >
                {!messages || messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-[13px] text-muted-foreground">
                            Say something nice to {userName} ✨
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

            {/* Scroll to bottom button */}
            {showScrollButton && (
                <Button
                    size="icon"
                    variant="outline"
                    onClick={scrollToBottom}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 h-9 w-9 rounded-full shadow-md bg-background/90 backdrop-blur-sm transition-opacity"
                >
                    <ChevronDown className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
