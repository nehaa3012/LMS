import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
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
            include: {
                questions: { orderBy: { order: 'asc' } },
                attempts: { where: { userId: user.id }, orderBy: { startedAt: 'desc' } }
            }
        });

        if (!quiz) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json({
            quiz,
            questions: quiz.questions,
            attempts: quiz.attempts
        });
    } catch (error) {
        console.error("[QUIZ_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
