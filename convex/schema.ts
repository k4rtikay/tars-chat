import { v } from "convex/values";
import { defineTable, defineSchema } from "convex/server";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    avatarUrl: v.optional(v.string()),
    lastSeen: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"]),

  conversations: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
    // Denormalized last message data for sidebar preview
    lastMessageBody: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.id("users")),
    lastMessageTime: v.optional(v.number()),
    // Read tracking — timestamps of when each participant last viewed the conversation
    lastReadByOne: v.optional(v.number()),
    lastReadByTwo: v.optional(v.number()),
  })
    .index("by_participant_one", ["participantOne"])
    .index("by_participant_two", ["participantTwo"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
  }).index("by_conversation", ["conversationId"]),
});