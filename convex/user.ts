import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, query, mutation } from "./_generated/server";

export const create = internalMutation({
    args: {
        username: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        role: v.string(),
        tokens: v.number(),
        quizgenStatus: v.literal("Idle"),
    },
    async handler(ctx, args) {
        return ctx.db
            .insert('users', args)
    },
})


export const get = internalQuery(
    {
        args: {
            clerkId: v.string(),

        },
        async handler(ctx, args) {
            return ctx.db
                .query('users')
                .withIndex('by_clerkId', q => q.eq("clerkId", args.clerkId))
                .unique()
        },
    }
)

export const getUser = query({
    args: {
        clerkId: v.string(),
    },
    async handler(ctx, { clerkId }) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq('clerkId', clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("user not Found ")

        }

        return user;
    }
})

export const addJoinedRoom = mutation({
    args: {
        clerkId: v.string(),
        roomId: v.string()
    },

    async handler(ctx, { clerkId, roomId }) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq('clerkId', clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("user not Found ")
        }

        const joinedRooms = user.joinedRooms || [];
        const newJoinedRooms = [...joinedRooms, roomId];

        return ctx.db.patch(user._id, { joinedRooms: newJoinedRooms });

    }
})


export const addQuiz = internalMutation({
    args: {
        clerkId: v.string(),
        quizId: v.string()
    },
    async handler(ctx, { clerkId, quizId }) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq('clerkId', clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("user not Found ")
        }

        const quizzes = user.quizzes || [];
        const newQuizzes = [...quizzes, quizId];

        return ctx.db.patch(user._id, { quizzes: newQuizzes });

    }
})

export const deductToken = mutation({
    args: {
        clerkId: v.string(),
        tokens: v.number()
    },
    async handler(ctx, { clerkId, tokens }) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq('clerkId', clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("user not Found ");
        }

        if ((user.tokens ?? 0) < tokens) {
            throw new ConvexError("Insufficient tokens");
        }

        const newTokens = (user.tokens ?? 0) - tokens;

        // Debug: log the deduction process
        console.debug(`Deducting ${tokens} tokens from user with clerkId ${clerkId}. New token count: ${newTokens}`);

        return ctx.db.patch(user._id, { tokens: newTokens });
    }
})

export const updateQuizgenStatus = mutation({
    args: {
        clerkId: v.string(),
        status: v.union(
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
            v.literal("Syncing With Database"),
        ),
    },
    async handler(ctx, { clerkId, status }) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq('clerkId', clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("user not Found ")
        }

        return ctx.db.patch(user._id, { quizgenStatus: status });

    }
})

export const hasEnoughTokens = query({
    args: {
        clerkId: v.string(),
        tokens: v.number()
    },
    async handler(ctx, { clerkId, tokens }) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", q => q.eq('clerkId', clerkId))
            .unique();

        if (!user) {
            throw new ConvexError("user not Found ")
        }

        return (user.tokens ?? 0) >= tokens;
    }
})