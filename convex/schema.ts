import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    role: v.string(),
    tokens: v.optional(v.number()), // deduct the token value when a quiz is generated
    joinedRooms: v.optional(v.array(v.string())), // rooms joined by the user
    quizzes: v.optional(v.array(v.string())), // quizes created by the user
    quizgenStatus: v.optional(v.union(
      v.literal("Idle"),
      v.literal("Received Request"),
      v.literal("Checking Available Tokens"),
      v.literal("Deciding if file can be processed"),
      v.literal("Processing File"),
      v.literal("File Processed"),
      v.literal("File Processing Failed"),
      v.literal("File Processed Successfully"),
      v.literal("Generating Quiz"),
      v.literal("Quiz Generated"),
      v.literal("Quiz Generation Failed"),
      
    )),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),




  rooms: defineTable({
    name: v.string(),
    status: v.union(
      v.literal("waiting"),
      v.literal("in-progress"),
      v.literal("completed"),
    ),
    // givenfile: v.object({
    //   url: v.string(),
    //   size: v.number(),
    //   fileName: v.string(),
    //   extension: v.string(),
    // }),
    hostedBy: v.string(),
    hostId: v.string(), // Owner/creator of the room
    roomId: v.string(),
    participants: v.optional(
      v.array(
        v.object({
          userId: v.optional(v.string()),
          imageUrl: v.optional(v.string()),
          email: v.optional(v.string()),
          name: v.optional(v.string()),
          score: v.optional(v.number()),
          status: v.optional(v.string()), // "ready" | "playing" | "finished"
          answers: v.optional(
            v.array(
              v.object({
                questionId: v.optional(v.number()),
                selectedOption: v.optional(v.string()),
                isCorrect: v.optional(v.boolean()),
                timeToAnswer: v.optional(v.number()),
              })
            )
          ),
        })
      )
    ),
    quiz: v.object({
      title: v.string(),
      description: v.optional(v.string()),
      numberOfQuestions: v.number(),
      questions: v.array(
        v.object({
          question: v.string(),
          options: v.array(v.string()),
          correctAnswer: v.string(),
          explanation: v.string(),
          points: v.optional(v.number()),
          timeLimit: v.optional(v.number()),
        })
      ),
    }),
    settings: v.object({
      maxParticipants: v.optional(v.number()),
      randomizeQuestions: v.optional(v.boolean()),
      waitForAllAnswers: v.optional(v.boolean()),
    }),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
  })
    .index("byRoomId", ["roomId"])
    .index("byHostId", ["hostId"]),







  quizes: defineTable({
    createdBy: v.string(),
    givenfile: v.object({
      url: v.string(),
      size: v.number(),
      fileName: v.string(),
      extension: v.string(),
    }),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    difficulty: v.optional(
      v.union(
        v.literal("easy"),
        v.literal("medium"),
        v.literal("hard")
      )
    ),
    timeLimit: v.optional(v.number()),
    instructions: v.optional(v.string()),
    numberOfQuestions: v.number(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.string(),
        points: v.optional(v.number()),
        hint: v.optional(v.string()),
        mediaUrl: v.optional(v.string()),
      })
    ),
    createdAt: v.number(), // Timestamp when quiz was created
  }).index("by_creator", ["createdBy"]),







  quizAttempts: defineTable({
    userId: v.string(),
    quizId: v.string(),
    score: v.number(),
    timeTaken: v.number(), // total time taken for the quiz in seconds
    answers: v.array(
      v.object({
        questionIndex: v.number(),
        selectedOption: v.string(),
        isCorrect: v.boolean(),
        timeToAnswer: v.number(), // time taken for this specific question
      })
    ),
    startedAt: v.number(),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_quiz", ["quizId"])
    .index("by_user_and_quiz", ["userId", "quizId"]),
});
