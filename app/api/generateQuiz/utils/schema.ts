import { z } from "zod";

export const processedschema = z.object({
    canBeProcessedOrNot: z.boolean().describe("true if the file can be processed, false otherwise"),
});

export const quizSchema = z.object({

    title: z.string().describe("The title of the quiz in seconds "),
    description: z.string().optional().describe("A brief overview of the quiz content"),
    category: z.string().optional().describe("The category or topic of the quiz"),
    difficulty: z.enum(["easy", "medium", "hard"]).optional().describe("The difficulty level of the quiz"),
    timeLimit: z.number().optional().describe("Time limit in seconds to complete the quiz"),
    instructions: z.string().optional().describe("Brief instructions for taking the quiz"),


    numberOfQuestions: z.number().describe("Total number of questions in the quiz"),
    questions: z.array(
        z.object({
            question: z.string().describe("The question text"),
            options: z.array(z.string()).describe("The choices available for the question"),
            correctAnswer: z.string().describe("The correct answer to the question"),
            explanation: z.string().describe("A short explanation for the correct answer"),
            points: z.number().optional().describe("Points awarded for a correct answer"),
            hint: z.string().optional().describe("A short hint to help answer the question"),
        })
    ).describe("The generated MCQ questions"),

});


