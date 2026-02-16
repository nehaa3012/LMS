import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { lessonId } = await params;
        const { userId } = await auth();

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                module: {
                    include: {
                        course: true,
                        lessons: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!lesson) {
            return new NextResponse("Not Found", { status: 404 });
        }

        let progress = null;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { clerkId: userId } });
            if (user) {
                progress = await prisma.progress.findUnique({
                    where: { userId_lessonId: { userId: user.id, lessonId } }
                });
            }
        }

        const lessons = lesson.module.lessons;
        const currentIndex = lessons.findIndex(l => l.id === lessonId);
        const nextLesson = lessons[currentIndex + 1] || null;
        const prevLesson = lessons[currentIndex - 1] || null;

        return NextResponse.json({
            lesson,
            progress,
            nextLesson,
            prevLesson
        });
    } catch (error) {
        console.error("[LESSON_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { lessonId } = await params;
        const { userId } = await auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const lesson = await prisma.lesson.findFirst({
            where: {
                id: lessonId,
                module: {
                    course: {
                        instructorId: user.id
                    }
                }
            }
        });

        if (!lesson) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedLesson = await prisma.lesson.update({
            where: { id: lessonId },
            data: { ...values }
        });

        return NextResponse.json(updatedLesson);
    } catch (error) {
        console.error("[LESSON_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
