import { v } from "convex/values";
import { defineTable, defineSchema } from "convex/server";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }).index("by_user", ["user"]),
});