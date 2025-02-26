import { generateObject } from "ai";
import { processedschema, quizSchema } from "./zodSchema";
import { google } from "@ai-sdk/google";
import { QUIZ_GENERATION_SYSTEM_MESSAGE, systemMessageFile } from "./systemMessagtes";
import { z } from "zod";

export function getHeaders(): Record<string, string> {
    console.log('Getting headers with API key');
    const headers = {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
    };
    console.log('Headers prepared:', { ...headers, Authorization: '[REDACTED]' });
    return headers;
}

export function buildPayload(urls: string[]) {
    console.log('Building payload for URLs:', urls);
    const basePayload = {
        formats: ["markdown"],
        onlyMainContent: true,
        excludeTags: ["img", "picture"],
        timeout: 6000000,
        actions: [],
        location: { country: "IN", languages: [] },
        removeBase64Images: true,
        blockAds: true,
    };

    if (urls.length === 1) {
        console.log('Creating single URL payload');
        return {
            endpoint: "https://api.firecrawl.dev/v1/scrape",
            payload: { ...basePayload, url: urls[0] },
        };
    } else {
        console.log('Creating batch URLs payload');
        return {
            endpoint: "https://api.firecrawl.dev/v1/batch/scrape",
            payload: { ...basePayload, urls },
        };
    }
}

export async function pollForBatchResult(
    batchId: string,
    headers: Record<string, string>
) {
    console.log('Starting batch polling for ID:', batchId);
    const pollInterval = 3000; // 5 seconds
    const maxTime = 10 * 60 * 1000; // 10 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxTime) {
        console.log(`Polling batch ID ${batchId}, elapsed time: ${Date.now() - startTime}ms`);
        const pollResponse = await fetch(
            `https://api.firecrawl.dev/v1/batch/scrape/${batchId}`,
            {
                method: "GET",
                headers,
            }
        );
        const scrapeResult = await pollResponse.json();
        console.log('Poll response status:', scrapeResult.status);

        if (
            scrapeResult.status === "scraping completed" ||
            scrapeResult.status === "completed"
        ) {
            console.log('Batch scraping completed successfully');
            return scrapeResult;
        } else if (scrapeResult.status === "failed") {
            console.log('Batch scraping failed:', scrapeResult);
            return {
                success: false,
                error: "Batch scraping failed",
                details: scrapeResult,
            };
        }
        console.log(`Waiting ${pollInterval}ms before next poll`);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
    console.log('Batch scraping timed out after', maxTime, 'ms');
    return { success: false, error: "Batch scraping timed out" };
}

export type ProcessedResult = z.infer<typeof processedschema>;

export async function canBeProcessedOrNotImage(
    fileUrl: string,
    fileType: string,
    mimeType: string,
): Promise<ProcessedResult> {
    try {


        // Create message parts.
        const textPart = { role: "user", text: "can this image be processed for generating mcq questions?" };
        const imagePart = { role: "user", type: "image", image: new URL(fileUrl).toString(), mimeType };

        // Combine parts into a single JSON string.
        const combinedContent = JSON.stringify([textPart, imagePart]);

        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: systemMessageFile,
            schema: processedschema,
            messages: [
                {
                    role: "user",
                    content: combinedContent,
                },
            ],
        });
        console.log('Object:', object);
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
): Promise<ProcessedResult> {
    try {


        const { object } = await generateObject({
            model: google("gemini-1.5-flash"),
            system: systemMessageFile,
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
        return object;
    } catch (error) {
        console.error("Error in canBeProcessedOrNotFile:", error);
        // Return only the properties defined in your schema.
        return { canBeProcessedOrNot: false };
    }
}

export type QuizResult = z.infer<typeof quizSchema>;

export async function generateQuizQuestionsImage(
    fileUrl: string,
    fileType: string,
    mimeType: string,
): Promise<QuizResult> {
    try {

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
        return object;
    } catch (error) {
        console.error("Error generating quiz questions for image:", error);
        throw error;
    }
}


export async function generateQuizQuestionsFile(
    fileUrl: string,
    fileType: string,
    mimeType: string,
): Promise<QuizResult> {
    try {
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
        return object;
    } catch (error) {
        console.error("Error generating quiz questions for file:", error);
        throw error;
    }
}
