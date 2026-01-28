import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
    razorpayCustomerId: v.optional(v.string()),
    razorpaySubscriptionId: v.optional(v.string()),
    plan: v.optional(v.string()), // 'free', 'pro', 'enterprise'
    credits: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_razorpaySubscriptionId", ["razorpaySubscriptionId"]),

  podcasts: defineTable({
    user: v.id("users"),
    title: v.string(),
    description: v.string(),
    audioUrl: v.string(),
    audioStorageId: v.optional(v.id("_storage")),
    imageUrl: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    author: v.string(),
    authorId: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_body", { searchField: "description" }),

  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
