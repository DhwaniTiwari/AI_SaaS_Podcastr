
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { internal } from "./_generated/api";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generatePodcastScript = action({
    args: { prompt: v.string(), voiceType: v.string(), audioDuration: v.number() },
    handler: async (ctx, { prompt, audioDuration }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        await ctx.runMutation(internal.users.deductCredits, { clerkId: identity.subject, count: 1 });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Write a podcast script for a podcast about ${prompt}. The script should be engaging and suitable for a ${audioDuration} minute audio.`);
        const response = await result.response;
        return response.text();
    },
});

export const generateAudioAction = action({
    args: { input: v.string(), voice: v.string() },
    handler: async (_, { input, voice }) => {
        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: { text: input },
                    voice: { languageCode: "en-US", name: voice || "en-US-Journey-F" },
                    audioConfig: { audioEncoding: "MP3" },
                }),
            }
        );

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        // Return ArrayBuffer
        return Buffer.from(data.audioContent, 'base64').buffer;
    },
});
