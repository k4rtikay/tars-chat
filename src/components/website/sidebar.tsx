"use client";

import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Id } from "@/../convex/_generated/dataModel";
import SearchResults from "@/components/website/search-results";
import ConversationList from "@/components/website/conversation-list";

interface SidebarProps {
    currentUserId: Id<"users"> | null;
}

export default function Sidebar({ currentUserId }: SidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const isSearching = searchQuery.trim().length > 0;

    return (
        <aside className="flex flex-col w-full md:w-80 h-screen md:border-r border-border bg-background">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold tracking-tight">tars chat</h1>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8",
                            },
                        }}
                    />
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search people..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm bg-accent/50 border-none focus-visible:ring-1"
                    />
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                    <SearchResults
                        searchQuery={searchQuery.trim()}
                        currentUserId={currentUserId}
                        onUserSelected={() => setSearchQuery("")}
                    />
                ) : (
                    <ConversationList
                        currentUserId={currentUserId}
                        emptyFallback={
                            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent">
                                    <MessageCircle className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-foreground">
                                        No conversations yet
                                    </p>
                                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                                        Search for someone above and
                                        <br />
                                        say hi 👋
                                    </p>
                                </div>
                            </div>
                        }
                    />
                )}
            </div>
        </aside>
    );
}
