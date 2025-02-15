import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { reqTtype } from "../utils/types";
import {
    canBeProcessedOrNotImage,
    canBeProcessedOrNotFile,
    generateQuizQuestionsImage,
    generateQuizQuestionsFile,
    syncToConvex
} from "../utils/functions";

export async function POST(request: NextRequest) {
    // Authenticate the user.
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update status: received request and check tokens.
    await fetchMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Received Request" });
    await fetchMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Checking Available Tokens" });

    const hasEnoughTokens = await fetchQuery(api.user.hasEnoughTokens, { clerkId: userId, tokens: 1 });
    if (!hasEnoughTokens) {
        return new NextResponse("Insufficient tokens", { status: 400 });
    }

    // Parse the request body and ensure at least one file is provided.
    const files: reqTtype[] = await request.json();
    if (!files.length) {
        return new NextResponse("No files provided", { status: 400 });
    }

    // Process only the first file.
    const file = files[0];
    let processableResult;
    if (file.mimeType.startsWith("image/")) {
        processableResult = await canBeProcessedOrNotImage(file.url, file.extension, file.mimeType, userId);
    } else {
        processableResult = await canBeProcessedOrNotFile(file.url, file.extension, file.mimeType, userId);
    }

    if (!processableResult.canBeProcessedOrNot) {
        await fetchMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "File Processing Failed" });
        return new NextResponse("File cannot be processed", { status: 200 });
    }

    // Update status to indicate that file processing succeeded.
    await fetchMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Processing File" });

    // Generate quiz questions based on the file type.
    let quizResult;
    if (file.mimeType.startsWith("image/")) {
        quizResult = await generateQuizQuestionsImage(file.url, file.extension, file.mimeType, userId);
    } else {
        quizResult = await generateQuizQuestionsFile(file.url, file.extension, file.mimeType, userId);
    }

    // Update final status.
    await fetchMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Quiz Generated" });

    await fetchMutation(api.user.updateQuizgenStatus, {
        clerkId: userId,
        status: "Syncing With Database"
    });

    const sucess = await syncToConvex(quizResult, userId, file);
    if (!sucess) {
        return new NextResponse("Error syncing with database", { status: 500 });
    }


    await fetchMutation(api.user.updateQuizgenStatus, { clerkId: userId, status: "Idle" });
    return NextResponse.json({
        message: "Data received",
        result: {
            fileName: file.fileName,
            processable: processableResult,
            quiz: quizResult,
        },
    });

}
