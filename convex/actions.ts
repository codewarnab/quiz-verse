import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { getHeaders, buildPayload, pollForBatchResult, canBeProcessedOrNotImage, canBeProcessedOrNotFile, generateQuizQuestionsImage, generateQuizQuestionsFile } from "./helpers";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { QUIZ_GENERATION_SYSTEM_MESSAGE, QUIZ_GENERATION_SYSTEM_MESSAGE_TEXT, systemMessage, systemMessageText } from "./systemMessagtes";
import { processedschema, quizSchema } from "./zodSchema";

type ScrapUrlsActionResult = {
    success: boolean;
    data?: unknown;
    error?: string;
    details?: unknown;
    mcqResult?: unknown;
};

export const scrapUrls = action({
    args: {
        urls: v.array(v.string()),
        userId: v.string(),
    },
    handler: async (
        ctx,
        { userId, urls }
    ): Promise<ScrapUrlsActionResult> => {
        try {
            // Update quiz generation status to "Received Request"
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Received Request",
            });

            // Check tokens
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Checking Available Tokens",
            });

            const hasTokens = await ctx.runQuery(api.user.hasEnoughTokens, {
                clerkId: userId,
                tokens: 1,
            });

            if (!hasTokens) {
                return { success: false, error: "Not enough tokens" };
            }

            // Validate URLs
            if (urls.length === 0) {
                return {
                    success: false,
                    error: "At least one URL parameter is required",
                };
            }

            // Prepare request to scraping endpoint
            const headers = getHeaders();
            const { endpoint, payload } = buildPayload(urls);

            // Fetch or poll for batch scraping result
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Scrapping data from Url",
            });

            const response = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });
            const responseData = await response.json();

            let data: unknown;
            if (urls.length === 1) {
                data = responseData;
            } else {
                if (responseData.success) {
                    const batchId = responseData.id;
                    data = await pollForBatchResult(batchId, headers);
                } else {
                    return {
                        success: false,
                        error: "Batch scraping request failed",
                        details: responseData,
                    };
                }
            }

            // Deduct token and process content
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Processing website content",
            });

            await ctx.runMutation(api.user.deductToken, {
                clerkId: userId,
                tokens: 1,
            });

            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Generating Quiz",
            });

            // Check if content can be processed
            const processedResult = await generateObject({
                model: google("gemini-1.5-flash"),
                system: systemMessage,
                schema: processedschema,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "can this markdown be processed for generating mcq questions?",
                            },
                            {
                                type: "text",
                                text: JSON.stringify(data),
                            },
                        ],
                    },
                ],
            });

            if (processedResult?.object?.canBeProcessedOrNot) {
                // Generate MCQ questions
                const mcqResult = await generateObject({
                    model: google("gemini-1.5-flash"),
                    system: QUIZ_GENERATION_SYSTEM_MESSAGE,
                    schema: quizSchema,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "generate mcq questions",
                                },
                                {
                                    type: "text",
                                    text: JSON.stringify(data),
                                },
                            ],
                        },
                    ],
                });

                await ctx.runMutation(api.user.updateQuizgenStatus, {
                    clerkId: userId,
                    status: "Quiz Generated",
                });

                const result = await ctx.runMutation(api.quizes.create, {
                    createdBy: userId,
                    givenUrl: urls,
                    title: mcqResult.object.title,
                    description: mcqResult.object.description,
                    category: mcqResult.object.category,
                    difficulty: mcqResult.object.difficulty,
                    timeLimit: mcqResult.object.timeLimit,
                    instructions: mcqResult.object.instructions,
                    numberOfQuestions: mcqResult.object.numberOfQuestions,
                    questions: mcqResult.object.questions,
                    createdAt: Date.now(),
                });

                // Update quiz generation status to "Idle"
                await ctx.runMutation(api.user.updateQuizgenStatus, {
                    clerkId: userId,
                    status: "Idle",
                });
                
                return { success: true, data: result, mcqResult: mcqResult.object };
            }

            // If content cannot be processed for quiz
            return { success: true, data };
        } catch (error: unknown) {
            console.error("Error in scrapUrls action:", error);
            return { success: false, error: "Internal Server Error" };
        }
    },
});


export const generateQuizfromText = action({
    args: {
        text: v.string(),
        userId: v.string(),
    },
    handler: async (
        ctx,
        { userId, text }
    ): Promise<ScrapUrlsActionResult> => {
        try {
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Received Request",
            });
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Checking Available Tokens",
            });

            const hasTokens = await ctx.runQuery(api.user.hasEnoughTokens, {
                clerkId: userId,
                tokens: 1,
            });

            if (!hasTokens) {
                return { success: false, error: "Not enough tokens" };
            }

            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Processing text content",
            });

            const processedResult = await generateObject({
                model: google("gemini-1.5-flash"),
                system: systemMessageText,
                schema: processedschema,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "can this text be processed for generating mcq questions?",
                            },
                            {
                                type: "text",
                                text: text,
                            },
                        ],
                    },
                ],

            });

            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Generating Quiz",
            });
            if (processedResult?.object?.canBeProcessedOrNot) {
                const mcqResult = await generateObject({
                    model: google("gemini-1.5-flash"),
                    system: QUIZ_GENERATION_SYSTEM_MESSAGE_TEXT,
                    schema: quizSchema,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: "generate mcq questions",
                                },
                                {
                                    type: "text",
                                    text: text,
                                },
                            ],
                        },
                    ],
                });

                await ctx.runMutation(api.user.updateQuizgenStatus, {
                    clerkId: userId,
                    status: "Quiz Generated",
                });

                const result = await ctx.runMutation(api.quizes.create, {
                    createdBy: userId,
                    givenText: text,
                    title: mcqResult.object.title,
                    description: mcqResult.object.description,
                    category: mcqResult.object.category,
                    difficulty: mcqResult.object.difficulty,
                    timeLimit: mcqResult.object.timeLimit,
                    instructions: mcqResult.object.instructions,
                    numberOfQuestions: mcqResult.object.numberOfQuestions,
                    questions: mcqResult.object.questions,
                    createdAt: Date.now(),
                });

                console.log(mcqResult.object)

                await ctx.runMutation(api.user.updateQuizgenStatus, {
                    clerkId: userId,
                    status: "Idle",
                });
                
                return { success: true, data: result, mcqResult: mcqResult.object };
            }

            return { success: true, data: processedResult };
        } catch (error: unknown) {
            console.error("Error in scrapUrls action:", error);
            return { success: false, error: "Internal Server Error" };
        }
    },

})


export const  generateQuizfromFile = action({
    args: {
        userId: v.string(),
        file: v.object({
            url: v.string(),
            size: v.number(),
            fileName: v.string(),
            extension: v.string(),
            mimeType: v.string(),
        }),
    },
    handler: async (
        ctx,
        { userId, file }
    ): Promise<any> => {
        try {
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Received Request",
            });
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Checking Available Tokens",
            });

            const hasTokens = await ctx.runQuery(api.user.hasEnoughTokens, {
                clerkId: userId,
                tokens: 1,
            });

            if (!hasTokens) {
                return { success: false, error: "Not enough tokens" };
            }

            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Processing File",
            });

            let processedResult;

            await ctx.runMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Deciding if file can be processed" });
            await ctx.runMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Deciding if file can be processed" });
            if (file.mimeType.startsWith("image/")) {
                processedResult = await canBeProcessedOrNotImage(file.url, file.extension, file.mimeType);
            } else {
                processedResult = await canBeProcessedOrNotFile(file.url, file.extension, file.mimeType);
            }
 console.log("processedResult",processedResult)
            if (!processedResult.canBeProcessedOrNot) {
                                return { success: false, error: "File cannot be processed" };
            }
            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Generating Quiz",
            });
            let mcqResult;
            if (file.mimeType.startsWith("image/")) {
                mcqResult = await generateQuizQuestionsImage(file.url, file.extension, file.mimeType);
            }
            else {
                mcqResult = await generateQuizQuestionsFile(file.url, file.extension, file.mimeType);

            }

            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Quiz Generated",
            });

            await ctx.runMutation(api.user.updateQuizgenStatus, {
                clerkId: userId,
                status: "Syncing With Database",
            });

            const givenFile = [{
                url: file.url,
                size: file.size,
                fileName: file.fileName,
                extension: file.extension,
            }]
            const res = await ctx.runMutation(api.quizes.create, {
                createdBy: userId,
                givenfiles: givenFile,
                title: mcqResult.title,
                description: mcqResult.description,
                category: mcqResult.category,
                difficulty: mcqResult.difficulty,
                timeLimit: mcqResult.timeLimit,
                instructions: mcqResult.instructions,
                numberOfQuestions: mcqResult.numberOfQuestions,
                questions: mcqResult.questions,
                createdAt: Date.now(),
            });

            // await ctx.runMutation(api.user.updateQuizgenStatus, {
            //     clerkId: userId,
            //     status: "Idle",
            // });

            console.log("mcqResult", mcqResult)
            return { success: true, data: res, mcqResult : mcqResult };
        } catch (error: unknown) {
            console.error("Error in scrapUrls action:", error);
            return { success: false, error: "Internal Server Error" };
        }
    },
})

