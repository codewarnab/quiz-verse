/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { generateText, generateObject } from "ai";
import { google } from "@ai-sdk/google";
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { systemMessage, QUIZ_GENERATION_SYSTEM_MESSAGE } from "./utils/systemMessage";
import { processedschema, quizSchema } from "./utils/schema";

export async function GET() {
    // Resolve file paths relative to this module.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const imagePath = join(__dirname, "image.jpg");
    const markdownPath = join(__dirname, "document.md");
    const pdfPath = join(__dirname, "document.pdf");

    // Process all files.
    const imageResult = await processFile(imagePath);
    const markdownResult = await processFile(markdownPath);
    const pdfResult = await processFile(pdfPath);

    console.log({ imageResult, markdownResult, pdfResult });

    return NextResponse.json({
        message: "Data received",
        result: { image: imageResult, markdown: markdownResult, pdf: pdfResult },
    });
}

async function canBeProcessedOrNot(
    fileData: any,
    fileType: string,
    mimeType: string
) {
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
                        data: fileData,
                        mimeType: mimeType,
                    },
                ],
            },
        ],
    });

    return object;
}

// New helper function to generate MCQ questions if the file can be processed.
async function generateQuizQuestions(fileData: any, fileType: string, mimeType: string) {
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
                        data: fileData,
                        mimeType: mimeType,
                    },
                ],
            },
        ],
    });
    return object;
}

// Wrapper function that determines the fileType and mimeType based on the file extension.
async function processFile(filePath: string) {
    // Read the file data.
    const fileData = fs.readFileSync(filePath);

    // Determine the file extension.
    const extension = filePath.split(".").pop()?.toLowerCase();
    let fileType: string;
    let mimeType: string;

    if (extension === "jpg" || extension === "jpeg" || extension === "png") {
        fileType = "image";
        mimeType = extension === "png" ? "image/png" : "image/jpeg";
    } else if (extension === "md") {
        fileType = "markdown";
        mimeType = "text/markdown";
    } else if (extension === "pdf") {
        fileType = "pdf";
        mimeType = "application/pdf";
    } else {
        throw new Error("Unsupported file type");
    }

    // Check if the file can be processed.
    const processableResult = await canBeProcessedOrNot(fileData, fileType, mimeType);

    // If the file can be processed, generate MCQ questions.
    if (processableResult.canBeProcessedOrNot) {
        const quizResult = await generateQuizQuestions(fileData, fileType, mimeType);
        console.log("Quiz Generation Result:", quizResult);
        return { ...processableResult, quiz: quizResult };
    }

    return processableResult;
}
