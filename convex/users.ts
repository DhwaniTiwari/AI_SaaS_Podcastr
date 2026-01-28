import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const getUserById = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    },
});

export const getTopUserByPodcastCount = query({
    args: {},
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users").collect();

        const userData = await Promise.all(
            user.map(async (u) => {
                const podcasts = await ctx.db
                    .query("podcasts")
                    .filter((q) => q.eq(q.field("authorId"), u.clerkId))
                    .collect();

                const sortedPodcasts = podcasts.sort((a, b) => b.views - a.views);

                return {
                    ...u,
                    totalPodcasts: podcasts.length,
                    podcast: sortedPodcasts.map((p) => ({
                        podcastTitle: p.title,
                        podcastId: p._id,
                    })),
                };
            })
        );

        return userData.sort((a, b) => b.totalPodcasts - a.totalPodcasts);
    },
});

export const updateUserPlan = internalMutation({
    args: {
        clerkId: v.string(),
        razorpaySubscriptionId: v.string(),
        plan: v.string(),
        credits: v.number()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .unique();

        if (!user) {
            console.log("User not found for webhook update");
            return;
        }

        await ctx.db.patch(user._id, {
            razorpaySubscriptionId: args.razorpaySubscriptionId,
            plan: args.plan,
            credits: args.credits
        });
    }
});

export const deductCredits = internalMutation({
    args: { clerkId: v.string(), count: v.number() },
    handler: async (ctx, { clerkId, count }) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), clerkId))
            .unique();

        if (!user) throw new Error("User not found");

        const currentCredits = user.credits || 0;

        if (currentCredits < count) {
            throw new Error("Insufficient credits");
        }

        await ctx.db.patch(user._id, {
            credits: currentCredits - count,
        });
    },
});
