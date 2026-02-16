import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req, { params }) {
    try {
        const { quizId } = await params;
        const { userId } = await auth();
        const { answers } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });

        if (!quiz) {
            return new NextResponse("Not Found", { status: 404 });
        }

        let correctCount = 0;
        const feedback = quiz.questions.map(q => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) correctCount++;
            return {
                questionId: q.id,
                correct: isCorrect,
                explanation: q.explanation
            };
        });

        const score = (correctCount / quiz.questions.length) * 100;
        const isPassed = score >= quiz.passingScore;

        const attempt = await prisma.quizAttempt.create({
            data: {
                userId: user.id,
                quizId,
                answers,
                score,
                isPassed,
                completedAt: new Date()
            }
        });

        // Award points if passed
        if (isPassed) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    totalPoints: { increment: 20 + (score === 100 ? 10 : 0) }
                }
            });
        }

        return NextResponse.json({
            attempt,
            score,
            isPassed,
            feedback
        });
    } catch (error) {
        console.error("[QUIZ_ATTEMPT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
