import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { httpRouter } from "convex/server";

const http = httpRouter();

const handleRazorpayWebhook = httpAction(async (ctx, request) => {
    const signature = request.headers.get("x-razorpay-signature");
    if (!signature) {
        return new Response("Missing signature", { status: 400 });
    }

    const body = await request.text();

    // Validate signature
    try {
        await ctx.runAction(internal.razorpay.validateWebhook, { signature, body });
    } catch (e) {
        return new Response("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle events
    if (event.event === "subscription.charged") {
        const subId = event.payload.subscription.entity.id;
        const userId = event.payload.subscription.entity.notes.userId;

        // Update user subscription status
        // We need a mutation to update user.
        // We can't call mutation from httpAction directly?
        // Yes we can: ctx.runMutation

        await ctx.runMutation(internal.users.updateUserPlan, {
            clerkId: userId,
            razorpaySubscriptionId: subId,
            plan: "pro",
            credits: 20 // Reset credits to pro level
        });
    }

    return new Response("OK", { status: 200 });
});

http.route({
    path: "/razorpay-webhook",
    method: "POST",
    handler: handleRazorpayWebhook,
});

export default http;
