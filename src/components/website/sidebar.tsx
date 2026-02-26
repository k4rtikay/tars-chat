"use client";

import { MessageCircle, Search } from "lucide-react";

interface Conversation {
    id: string;
    name: string;
    lastMessage?: string;
}

interface SidebarProps {
    conversations?: Conversation[];
}

export default function Sidebar({ conversations = [] }: SidebarProps) {
    const hasConversations = conversations.length > 0;

    return (
        <aside className="flex flex-col w-80 h-screen border-r border-border bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h1 className="text-lg font-semibold tracking-tight">tars chat</h1>
                <button
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Search conversations"
                >
                    <Search className="w-[18px] h-[18px]" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
                {hasConversations ? (
                    // TODO: render conversation list
                    <div className="px-3 py-2">
                        {conversations.map((c) => (
                            <div key={c.id}>{c.name}</div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent">
                            <MessageCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-foreground">
                                No conversations yet
                            </p>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                Your chats will live here — go say
                                <br />
                                hi to someone 👋
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
