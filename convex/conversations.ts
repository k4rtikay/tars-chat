import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
    args: {
        participantOne: v.id("users"),
        participantTwo: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Check both orderings since we don't enforce order
        const existing =
            (await ctx.db
                .query("conversations")
                .withIndex("by_participant_one", (q) =>
                    q.eq("participantOne", args.participantOne),
                )
                .filter((q) =>
                    q.eq(q.field("participantTwo"), args.participantTwo),
                )
                .unique()) ??
            (await ctx.db
                .query("conversations")
                .withIndex("by_participant_one", (q) =>
                    q.eq("participantOne", args.participantTwo),
                )
                .filter((q) =>
                    q.eq(q.field("participantTwo"), args.participantOne),
                )
                .unique());

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("conversations", {
            participantOne: args.participantOne,
            participantTwo: args.participantTwo,
        });
    },
});

export const listForUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        // Find all conversations where the user is a participant
        const asParticipantOne = await ctx.db
            .query("conversations")
            .withIndex("by_participant_one", (q) =>
                q.eq("participantOne", args.userId),
            )
            .collect();

        const asParticipantTwo = await ctx.db
            .query("conversations")
            .withIndex("by_participant_two", (q) =>
                q.eq("participantTwo", args.userId),
            )
            .collect();

        const allConversations = [...asParticipantOne, ...asParticipantTwo];

        // For each conversation, resolve the other participant's user data and compute unread count
        const enriched = await Promise.all(
            allConversations
                .filter((conv) => conv.lastMessageTime) // only show convos with messages
                .map(async (conv) => {
                    const otherUserId =
                        conv.participantOne === args.userId
                            ? conv.participantTwo
                            : conv.participantOne;

                    const otherUser = await ctx.db.get(otherUserId);

                    // Determine this user's lastRead timestamp
                    const lastRead =
                        conv.participantOne === args.userId
                            ? conv.lastReadByOne
                            : conv.lastReadByTwo;

                    // Count unread messages (messages after lastRead that weren't sent by this user)
                    let unreadCount = 0;
                    if (lastRead !== undefined) {
                        const messagesAfterRead = await ctx.db
                            .query("messages")
                            .withIndex("by_conversation", (q) =>
                                q.eq("conversationId", conv._id),
                            )
                            .filter((q) =>
                                q.and(
                                    q.gt(q.field("_creationTime"), lastRead),
                                    q.neq(q.field("senderId"), args.userId),
                                ),
                            )
                            .collect();
                        unreadCount = messagesAfterRead.length;
                    } else {
                        // Never read — count all messages not sent by this user
                        const allUnread = await ctx.db
                            .query("messages")
                            .withIndex("by_conversation", (q) =>
                                q.eq("conversationId", conv._id),
                            )
                            .filter((q) => q.neq(q.field("senderId"), args.userId))
                            .collect();
                        unreadCount = allUnread.length;
                    }

                    return {
                        _id: conv._id,
                        otherUser: otherUser
                            ? { _id: otherUser._id, name: otherUser.name, avatarUrl: otherUser.avatarUrl }
                            : null,
                        lastMessageBody: conv.lastMessageBody,
                        lastMessageSenderId: conv.lastMessageSenderId,
                        lastMessageTime: conv.lastMessageTime,
                        unreadCount,
                    };
                }),
        );

        // Sort by most recent message first
        return enriched.sort(
            (a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0),
        );
    },
});

export const markRead = mutation({
    args: {
        conversationId: v.id("conversations"),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) return;

        const now = Date.now();

        if (conversation.participantOne === args.userId) {
            await ctx.db.patch(args.conversationId, { lastReadByOne: now });
        } else if (conversation.participantTwo === args.userId) {
            await ctx.db.patch(args.conversationId, { lastReadByTwo: now });
        }
    },
});
