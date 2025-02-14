import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    role: v.string(),
  }).index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

    rooms: defineTable({
      name: v.string(),
      roomId: v.string(),
      description: v.optional(v.string()), // Optional description field
      owner: v.string(), // User ID of the owner
      participants: v.array(v.string()), // List of user IDs
      status: v.string(), // Status of the room
      createdAt: v.number(),
      updatedAt: v.optional(v.number()), // Optional updated timestamp
      quiz: v.optional(v.object({
        title: v.string(),
        questions: v.array(v.object({
          question: v.string(),
          options: v.array(v.string()),
          answer: v.string()
        }))
      }))
    }).index("byRoomId", ["roomId"]),
    
});

