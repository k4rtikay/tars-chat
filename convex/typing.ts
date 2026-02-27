import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const setTyping = mutation({
    args: {
        conversationId: v.id("conversations"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Find existing indicator for this user + conversation
        const existing = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId),
            )
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .unique();

        const now = Date.now();

        if (existing) {
            await ctx.db.patch(existing._id, { updatedAt: now });
        } else {
            await ctx.db.insert("typingIndicators", {
                conversationId: args.conversationId,
                userId: args.userId,
                updatedAt: now,
            });
        }
    },
});

export const clearTyping = mutation({
    args: {
        conversationId: v.id("conversations"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId),
            )
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});

export const getTyping = query({
    args: {
        conversationId: v.id("conversations"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Get all typing indicators for this conversation except the current user
        const indicators = await ctx.db
            .query("typingIndicators")
            .withIndex("by_conversation", (q) =>
                q.eq("conversationId", args.conversationId),
            )
            .filter((q) => q.neq(q.field("userId"), args.userId))
            .collect();

        return indicators;
    },
});
