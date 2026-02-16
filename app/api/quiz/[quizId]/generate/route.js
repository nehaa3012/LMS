import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { generateQuiz } from "@/lib/ai/quiz-generator";

export async function POST(req, { params }) {
    try {
        const { quizId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { lesson: true }
        });

        if (!quiz) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Use lesson content as context if available, otherwise use quiz title/description?
        const content = quiz.lesson?.content || quiz.description || quiz.title;

        const { questions } = await generateQuiz(content, { numQuestions: 5, difficulty: 'medium' });

        // Delete existing questions? Or append? AGENT.md says "generate quiz", usually implies creating new set.
        // For now, let's create them.
        const createdQuestions = await Promise.all(questions.map((q, index) =>
            prisma.question.create({
                data: {
                    quizId,
                    question: q.question,
                    type: 'MULTIPLE_CHOICE',
                    order: index,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    difficulty: q.difficulty,
                    topic: q.topic
                }
            })
        ));

        return NextResponse.json({ quiz, questions: createdQuestions });
    } catch (error) {
        console.error("[QUIZ_GENERATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
