import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const verifyUserHasCredits = internalAction({
    args: { clerkId: v.string(), cost: v.number() },
    handler: async (ctx, { clerkId, cost }) => {
        // This should probably be a mutation or query in 'users.ts' to check db, not action.
        // Actions can call queries.
        // But verifying credits usually happens before generating.
        // Let's create a query in users.ts `getUserCredits` or similiar.
    }
});
