import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const create = mutation({
    args: {
        createdBy: v.string(),
        givenfiles: v.array(
            v.object({
                url: v.string(),
                size: v.number(),
                fileName: v.string(),
                extension: v.string(),
            })
        ),
        title: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        difficulty: v.optional(
            v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))
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
            })
        ),
        createdAt: v.number(),
    },
    async handler(ctx, args) {
        
        const quizId = await ctx.db.insert("quizes", args);
        await ctx.runMutation(internal.user.addQuiz, {
            clerkId: args.createdBy,
            quizId,
        });

        // Return the quizId or any other desired response.
        return quizId;
    },
});

