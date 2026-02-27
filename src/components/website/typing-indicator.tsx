"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { useState, useEffect } from "react";

const TYPING_TIMEOUT = 2000;

interface TypingIndicatorProps {
    conversationId: Id<"conversations"> | null;
    currentUserId: Id<"users"> | null;
}

export default function TypingIndicator({
    conversationId,
    currentUserId,
}: TypingIndicatorProps) {
    const [isVisible, setIsVisible] = useState(false);

    const indicators = useQuery(
        api.typing.getTyping,
        conversationId && currentUserId
            ? { conversationId, userId: currentUserId }
            : "skip",
    );

    // Client-side staleness check — re-evaluate every second
    useEffect(() => {
        if (!indicators || indicators.length === 0) {
            setIsVisible(false);
            return;
        }

        function check() {
            const now = Date.now();
            const hasActive = indicators!.some(
                (ind) => now - ind.updatedAt < TYPING_TIMEOUT,
            );
            setIsVisible(hasActive);
        }

        check();
        const interval = setInterval(check, 1000);
        return () => clearInterval(interval);
    }, [indicators]);

    if (!isVisible) return null;

    return (
        <div className="flex items-center gap-1.5 px-4 py-2">
            <div className="flex items-center gap-1 bg-accent rounded-full px-3 py-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
            </div>
        </div>
    );
}
