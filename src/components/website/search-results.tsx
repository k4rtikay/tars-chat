"use client";

import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { User } from "lucide-react";
import { useChatContext } from "@/components/website/chat-context";

interface SearchResultsProps {
    searchQuery: string;
    currentUserId: Id<"users"> | null;
    onUserSelected?: () => void;
}

export default function SearchResults({
    searchQuery,
    currentUserId,
    onUserSelected,
}: SearchResultsProps) {
    const users = useQuery(api.users.list);
    const { selectedUser, setSelectedUser } = useChatContext();

    if (!users) {
        return (
            <div className="px-3 py-2 space-y-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg"
                    >
                        <div className="w-9 h-9 rounded-full bg-accent animate-pulse shrink-0" />
                        <div className="h-3.5 w-28 bg-accent animate-pulse rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const filtered = users.filter((user) => {
        if (currentUserId && user._id === currentUserId) return false;
        return user.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-3">
                <p className="text-sm text-muted-foreground">
                    No one goes by &ldquo;{searchQuery}&rdquo; — yet 🤷
                </p>
            </div>
        );
    }

    return (
        <div className="px-3 py-2 space-y-0.5">
            {filtered.map((user) => {
                const isActive = selectedUser?._id === user._id;
                return (
                    <button
                        key={user._id}
                        onClick={() => {
                            setSelectedUser({
                                _id: user._id,
                                name: user.name,
                                avatarUrl: user.avatarUrl,
                            });
                            onUserSelected?.();
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left transition-colors ${isActive
                                ? "bg-accent"
                                : "hover:bg-accent/60"
                            }`}
                    >
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent shrink-0">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                        )}
                        <span className="text-sm font-medium truncate">{user.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
