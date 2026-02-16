import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const enrollment = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: user.id, courseId } }
        });

        if (!enrollment) {
            return NextResponse.json({ progress: 0 });
        }

        const totalLessons = await prisma.lesson.count({
            where: { module: { courseId } }
        });

        const completedLessons = await prisma.progress.count({
            where: { userId: user.id, lesson: { module: { courseId } }, isCompleted: true }
        });

        const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return NextResponse.json({
            progress: progressPercentage,
            completedLessons,
            totalLessons,
            timeSpent: enrollment.totalTimeSpent
        });
    } catch (error) {
        console.error("[COURSE_PROGRESS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
