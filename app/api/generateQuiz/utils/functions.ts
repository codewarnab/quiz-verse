import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { systemMessage } from "../utils/systemMessage";
import { processedschema } from "../utils/schema";
import { z } from "zod";
import { QUIZ_GENERATION_SYSTEM_MESSAGE } from "../utils/systemMessage";
import { quizSchema } from "../utils/schema";

// Inferred type from your schema.
export type ProcessedResult = z.infer<typeof processedschema>;

export async function canBeProcessedOrNotImage(
    fileUrl: string,
    fileType: string,
    mimeType: string,
    clerkId: string
): Promise<ProcessedResult> {
    try {
        // Update status before processing.
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Deciding if file can be processed" });

        // Create message parts.
        const textPart = { role: "user", text: "can this file be processed for generating mcq questions?" };
        const imagePart = { role: "user", type: "image", image: new URL(fileUrl).toString(), mimeType };

        // Combine parts into a single JSON string.
        const combinedContent = JSON.stringify([textPart, imagePart]);

        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: systemMessage,
            schema: processedschema,
            messages: [
                {
                    role: "user",
                    content: combinedContent,
                },
            ],
        });

        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Processing File" });
        return object;
    } catch (error) {
        console.error("Error in canBeProcessedOrNotImage:", error);
        // Remove the error property to match the schema.
        return { canBeProcessedOrNot: false };
    }
}

export async function canBeProcessedOrNotFile(
    fileUrl: string,
    fileType: string,
    mimeType: string,
    clerkId: string
): Promise<ProcessedResult> {
    try {
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Deciding if file can be processed" });
        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: systemMessage,
            schema: processedschema,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `can this ${fileType} file be processed for generating mcq questions?`,
                        },
                        {
                            type: "file",
                            data: new URL(fileUrl).toString(),
                            mimeType: mimeType,
                        },
                    ],
                },
            ],
        });
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Processing File" });
        return object;
    } catch (error) {
        console.error("Error in canBeProcessedOrNotFile:", error);
        // Return only the properties defined in your schema.
        return { canBeProcessedOrNot: false };
    }
}



// Optionally infer a type from your quiz schema.
export type QuizResult = z.infer<typeof quizSchema>;

/**
 * Generates quiz questions using file-type messaging.
 * Uses a message with a file attachment.
 */
export async function generateQuizQuestionsFile(
    fileUrl: string,
    fileType: string,
    mimeType: string,
    clerkId: string
): Promise<QuizResult> {
    try {
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Generating Quiz" });
        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: QUIZ_GENERATION_SYSTEM_MESSAGE,
            schema: quizSchema,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Generate MCQ questions based on this ${fileType} file.`,
                        },
                        {
                            type: "file",
                            data: new URL(fileUrl).toString(),
                            mimeType: mimeType,
                        },
                    ],
                },
            ],
        });
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Quiz Generated" });
        return object;
    } catch (error) {
        console.error("Error generating quiz questions for file:", error);
        throw error;
    }
}

/**
 * Generates quiz questions using image-type messaging.
 * Uses separate text and image message parts combined into a single JSON string.
 */
export async function generateQuizQuestionsImage(
    fileUrl: string,
    fileType: string,
    mimeType: string,
    clerkId: string
): Promise<QuizResult> {
    try {
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Generating Quiz" });

        // Create message parts.
        const textPart = { role: "user", text: `Generate MCQ questions based on this ${fileType} file.` };
        const imagePart = { role: "user", type: "image", image: new URL(fileUrl).toString(), mimeType };
        // Combine the parts into a single JSON string.
        const combinedContent = JSON.stringify([textPart, imagePart]);

        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: QUIZ_GENERATION_SYSTEM_MESSAGE,
            schema: quizSchema,
            messages: [
                {
                    role: "user",
                    content: combinedContent,
                },
            ],
        });
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId, status: "Quiz Generated" });
        return object;
    } catch (error) {
        console.error("Error generating quiz questions for image:", error);
        throw error;
    }
}
