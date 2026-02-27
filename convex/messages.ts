import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
  },
});

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Insert the message
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      body: args.body,
    });

    // Update the conversation with last message preview data
    await ctx.db.patch(args.conversationId, {
      lastMessageBody: args.body,
      lastMessageSenderId: args.senderId,
      lastMessageTime: now,
    });
  },
});