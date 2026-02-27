"use client";

import { createContext, useContext, useState } from "react";
import { Id } from "@/../convex/_generated/dataModel";

export interface ChatUser {
    _id: Id<"users">;
    name: string;
    avatarUrl?: string;
}

interface ChatContextValue {
    selectedUser: ChatUser | null;
    setSelectedUser: (user: ChatUser | null) => void;
    currentUserId: Id<"users"> | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({
    children,
    currentUserId,
}: {
    children: React.ReactNode;
    currentUserId: Id<"users"> | null;
}) {
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

    return (
        <ChatContext.Provider value={{ selectedUser, setSelectedUser, currentUserId }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChatContext() {
    const ctx = useContext(ChatContext);
    if (!ctx) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return ctx;
}
