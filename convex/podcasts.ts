import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPodcastById = query({
    args: { podcastId: v.id("podcasts") },
    handler: async (ctx, args) => {
        const podcast = await ctx.db.get(args.podcastId);
        return podcast;
    },
});

export const createPodcast = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        audioUrl: v.string(),
        imageUrl: v.string(),
        voiceType: v.string(),
        imagePrompt: v.string(),
        voicePrompt: v.string(),
        views: v.number(),
        audioDuration: v.number(),
        audioStorageId: v.optional(v.id("_storage")),
        imageStorageId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("User not authenticated");
        }

        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), identity.email))
            .collect();

        if (user.length === 0) {
            throw new ConvexError("User not found");
        }

        const podcast = await ctx.db.insert("podcasts", {
            ...args,
            user: user[0]._id,
            author: user[0].name,
            authorId: user[0].clerkId,
        });

        return podcast;
    },
});

export const getUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const getTrendingPodcasts = query({
    handler: async (ctx) => {
        const podcasts = await ctx.db.query("podcasts").collect();
        return podcasts;
    },
});

export const getPodcastBySearch = query({
    args: { search: v.string() },
    handler: async (ctx, args) => {
        if (args.search === "") {
            return await ctx.db.query("podcasts").order("desc").collect();
        }
        const titleSearch = await ctx.db
            .query("podcasts")
            .withSearchIndex("search_title", (q) => q.search("title", args.search))
            .take(10);

        if (titleSearch.length > 0) {
            return titleSearch;
        }

        return await ctx.db
            .query("podcasts")
            .withSearchIndex("search_body", (q) => q.search("description", args.search))
            .take(10);
    },
});

export const getPodcastByAuthorId = query({
    args: { authorId: v.string() },
    handler: async (ctx, args) => {
        const podcasts = await ctx.db
            .query("podcasts")
            .filter((q) => q.eq(q.field("authorId"), args.authorId))
            .collect();

        return podcasts;
    },
});
