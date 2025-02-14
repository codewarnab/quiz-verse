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
      status: v.string(),// "waiting" | "in-progress" | "completed"
      hostedBy: v.string(), 
      hostId: v.string(), // User who created the room
      roomId: v.string(),
      participants: v.optional(v.array(v.object({
        userId: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        score: v.optional(v.number()),
        status: v.optional(v.string()), // "ready" | "playing" | "finished"
        answers: v.optional(v.array(v.object({
          questionId: v.optional(v.number()),
          selectedOption: v.optional(v.string()),
          isCorrect: v.optional(v.boolean()),
          timeToAnswer: v.optional(v.number()), // in seconds, for tiebreakers
        }))),
      }))),
      quiz: v.object({
        title: v.string(),
        description: v.optional(v.string()),
        numberOfQuestions: v.number(),
        questions: v.array(v.object({
          question: v.string(),
          options: v.array(v.string()),
          correctAnswer: v.string(), // Add correctAnswer field
          explanation: v.string(),
          points: v.optional(v.number()), // Optional points per question
          timeLimit: v.optional(v.number()), // Time limit in seconds
        })),
      }),
      settings: v.object({
        maxParticipants: v.optional(v.number()),
        randomizeQuestions: v.optional(v.boolean()),//future feature
        waitForAllAnswers: v.optional(v.boolean()), // (future maybe)Whether to wait for all participants to answer before next question
      }),
      // currentQuestionIndex: v.optional(v.number()), // Track current question during the quiz
      startedAt: v.optional(v.number()), // Timestamp when quiz started
      endedAt: v.optional(v.number()), // Timestamp when quiz ended
    }).index("byRoomId", ["roomId"]),
    
});

