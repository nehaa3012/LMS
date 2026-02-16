import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { generateQuiz } from "@/lib/ai/quiz-generator";

export async function GET(req, { params }) {
    try {
        const { lessonId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { quizzes: { include: { questions: true } } }
        });

        if (!lesson) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Check if an AI quiz already exists
        const existingAiQuiz = lesson.quizzes.find(q => q.isAiGenerated);
        if (existingAiQuiz) {
            return NextResponse.json({
                quiz: existingAiQuiz,
                questions: existingAiQuiz.questions,
                cached: true
            });
        }

        // Generate new AI quiz
        const { questions } = await generateQuiz(lesson.content, { numQuestions: 5, difficulty: 'medium' });

        const quiz = await prisma.quiz.create({
            data: {
                lessonId,
                title: `AI Quiz: ${lesson.title}`,
                isAiGenerated: true,
                generatedFrom: lesson.content,
                questions: {
                    create: questions.map((q, index) => ({
                        question: q.question,
                        type: 'MULTIPLE_CHOICE',
                        order: index,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        difficulty: q.difficulty,
                        topic: q.topic
                    }))
                }
            },
            include: { questions: true }
        });

        return NextResponse.json({
            quiz,
            questions: quiz.questions,
            cached: false
        });
    } catch (error) {
        console.error("[LESSON_QUIZ_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
