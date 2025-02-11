import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SignInForm() {
    return (
        <div className="min-h-[calc(100vh-6rem)] flex justify-center items-center bg-gray-900 p-4">
            <Card className="w-full max-w-md bg-gray-800 border-none text-white">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl font-bold text-center">
                        Welcome to QuizVerse
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                        Sign in to start creating and taking multimedia quizzes
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <SignInButton mode="modal">
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            size="lg"
                        >
                            Sign in
                        </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white border-none"
                            variant="outline"
                            size="lg"
                        >
                            Create an account
                        </Button>
                    </SignUpButton>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignInForm;


