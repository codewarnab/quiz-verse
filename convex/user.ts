import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

export const create = internalMutation({
    args: {
        username: v.string(),
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        role: v.string(),
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