"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import Razorpay from "razorpay";
import crypto from "crypto";
import { internal } from "./_generated/api";

// Initialize properly inside actions to avoid build-time errors if env vars are missing
// const razorpay = new Razorpay({ ... }); 

export const createSubscription = action({
    args: { planType: v.string() }, // 'pro'
    handler: async (ctx, { planType }) => {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });

        // 1. Determine Plan ID based on type (Create Plans in Razorpay Dashboard first manually or via API)
        // For simplicity, we assume one Pro Plan ID is set in Env or we create a fixed one.
        // Ideally user creates a plan in Razorpay Dashboard and puts ID in env.
        // Let's assume RAZORPAY_PRO_PLAN_ID is in env.
        const planId = process.env.RAZORPAY_PRO_PLAN_ID;

        if (!planId) throw new Error("Pro Plan ID not configured");

        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        // 2. Create Subscription
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 12, // 1 year? or infinite? Razorpay requires count. 12 months is fine for now or bigger number.
            // quantity: 1,
            // add_ons: [],
            notes: {
                userId: identity.subject, // Store Clerk ID or Convex ID
            },
        });

        return subscription;
    },
});

// Helper to create the plan if user doesn't have one
export const createProPlan = action({
    args: {},
    handler: async (ctx) => {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || "",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });

        try {
            const plan = await razorpay.plans.create({
                period: "monthly",
                interval: 1,
                item: {
                    name: "Pro Plan",
                    amount: 39900,
                    currency: "INR",
                    description: "Pro Subscription for Podcastr"
                },
                notes: {
                    app: "Podcastr"
                }
            });

            return plan.id;
        } catch (error) {
            console.error("Error creating plan", error);
            throw new Error("Failed to create plan");
        }
    }
});

export const validateWebhook = internalAction({
    args: { signature: v.string(), body: v.string() },
    handler: async (ctx, { signature, body }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) throw new Error("Webhook secret not configured");

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            throw new Error("Invalid signature");
        }

        return true;
    },
});
