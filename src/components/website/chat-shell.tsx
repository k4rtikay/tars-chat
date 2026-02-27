"use client";

import { useEffect } from "react";
import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { SignInButton } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Sidebar from "@/components/website/sidebar";
import { ChatProvider, useChatContext } from "@/components/website/chat-context";
import { MessageSquare } from "lucide-react";
import { Id } from "@/../convex/_generated/dataModel";

export default function ChatShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated, userId } = useStoreUserEffect();
    const updateLastSeen = useMutation(api.users.updateLastSeen);

    // Heartbeat — update lastSeen every 30 seconds
    useEffect(() => {
        if (!userId) return;

        // Fire immediately on mount
        updateLastSeen({ userId });

        const interval = setInterval(() => {
            updateLastSeen({ userId });
        }, 30_000);

        return () => clearInterval(interval);
    }, [userId, updateLastSeen]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-8">
                <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent">
                    <MessageSquare className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="space-y-1.5">
                    <p className="text-sm font-medium text-foreground">
                        Welcome to tars chat
                    </p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        Sign in to start chatting with your people
                    </p>
                </div>
                <SignInButton>
                    <button className="mt-2 px-5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        Sign in
                    </button>
                </SignInButton>
            </div>
        );
    }

    return (
        <ChatProvider currentUserId={userId}>
            <ChatLayout currentUserId={userId}>{children}</ChatLayout>
        </ChatProvider>
    );
}

function ChatLayout({
    children,
    currentUserId,
}: {
    children: React.ReactNode;
    currentUserId: Id<"users"> | null;
}) {
    const { selectedUser } = useChatContext();

    return (
        <div className="flex h-screen">            
            <div className={`${selectedUser ? "hidden" : "flex"} md:flex flex-col w-full md:w-auto`}>
                <Sidebar currentUserId={currentUserId} />
            </div>
            <main className={`${selectedUser ? "flex" : "hidden"} md:flex flex-1 flex-col overflow-hidden`}>
                {children}
            </main>
        </div>
    );
}
