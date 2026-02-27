"use client";

import { useStoreUserEffect } from "@/hooks/useStoreUserEffect";
import { SignInButton } from "@clerk/nextjs";
import Sidebar from "@/components/website/sidebar";
import { ChatProvider } from "@/components/website/chat-context";
import { MessageSquare } from "lucide-react";

export default function ChatShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated, userId } = useStoreUserEffect();

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
            <div className="flex h-screen">
                <Sidebar currentUserId={userId} />
                <main className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </ChatProvider>
    );
}
