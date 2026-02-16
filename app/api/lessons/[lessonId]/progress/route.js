import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req, { params }) {
    try {
        const { lessonId } = await params;
        const { userId } = await auth();
        const { isCompleted, timeSpent, lastPosition } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const progress = await prisma.progress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.id,
                    lessonId
                }
            },
            update: {
                isCompleted,
                timeSpent: { increment: timeSpent || 0 },
                lastPosition: lastPosition || 0,
                completedAt: isCompleted ? new Date() : undefined
            },
            create: {
                userId: user.id,
                lessonId,
                isCompleted,
                timeSpent: timeSpent || 0,
                lastPosition: lastPosition || 0,
                completedAt: isCompleted ? new Date() : null
            }
        });

        // Update enrollment total time
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { module: true }
        });

        if (lesson) {
            await prisma.enrollment.update({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: lesson.module.courseId
                    }
                },
                data: {
                    totalTimeSpent: { increment: Math.floor((timeSpent || 0) / 60) }, // store in minutes
                    lastAccessedAt: new Date()
                }
            });
        }

        return NextResponse.json(progress);
    } catch (error) {
        console.error("[LESSON_PROGRESS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
