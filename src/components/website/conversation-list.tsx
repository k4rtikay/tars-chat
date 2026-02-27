"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { User } from "lucide-react";
import { useChatContext } from "@/components/website/chat-context";
import { Badge } from "@/components/ui/badge";
import { formatMessageTime, isOnline } from "@/lib/format-time";

interface ConversationListProps {
    currentUserId: Id<"users"> | null;
    emptyFallback?: React.ReactNode;
}

export default function ConversationList({ currentUserId, emptyFallback }: ConversationListProps) {
    const { selectedUser, setSelectedUser } = useChatContext();

    const conversations = useQuery(
        api.conversations.listForUser,
        currentUserId ? { userId: currentUserId } : "skip",
    );

    if (!conversations) {
        return (
            <div className="px-3 py-2 space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg"
                    >
                        <div className="w-10 h-10 rounded-full bg-accent animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-24 bg-accent animate-pulse rounded" />
                            <div className="h-3 w-36 bg-accent animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return <>{emptyFallback}</>;
    }

    return (
        <div className="px-3 py-2 space-y-0.5">
            {conversations.map((conv) => {
                if (!conv.otherUser) return null;

                const isActive = selectedUser?._id === conv.otherUser._id;
                const isOwnMessage = conv.lastMessageSenderId === currentUserId;

                return (
                    <button
                        key={conv._id}
                        onClick={() =>
                            setSelectedUser({
                                _id: conv.otherUser!._id,
                                name: conv.otherUser!.name,
                                avatarUrl: conv.otherUser!.avatarUrl,
                            })
                        }
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/60"
                            }`}
                    >
                        {/* Avatar with online indicator */}
                        <div className="relative shrink-0">
                            {conv.otherUser.avatarUrl ? (
                                <img
                                    src={conv.otherUser.avatarUrl}
                                    alt={conv.otherUser.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                            )}
                            {isOnline(conv.otherUser.lastSeen) && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background" />
                            )}
                        </div>

                        {/* Name + preview */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium truncate">
                                    {conv.otherUser.name}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    {conv.lastMessageTime && (
                                        <span className="text-[11px] text-muted-foreground">
                                            {formatMessageTime(conv.lastMessageTime)}
                                        </span>
                                    )}
                                    {conv.unreadCount > 0 && (
                                        <Badge className="min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full justify-center">
                                            {conv.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {conv.lastMessageBody && (
                                <p className={`text-[13px] truncate mt-0.5 ${conv.unreadCount > 0
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground"
                                    }`}>
                                    {isOwnMessage ? "You: " : ""}
                                    {conv.lastMessageBody}
                                </p>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
