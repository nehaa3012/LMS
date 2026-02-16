import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const { userId } = await auth();
        const { courseId } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        // Check if course is completed
        const totalLessons = await prisma.lesson.count({
            where: { module: { courseId } }
        });

        const completedLessons = await prisma.progress.count({
            where: {
                userId: user.id,
                lesson: { module: { courseId } },
                isCompleted: true
            }
        });

        if (totalLessons === 0 || completedLessons < totalLessons) {
            return new NextResponse("Course not completed", { status: 400 });
        }

        // Check if certificate already exists
        const existing = await prisma.certificate.findUnique({
            where: { userId_courseId: { userId: user.id, courseId } }
        });

        if (existing) {
            return NextResponse.json({ certificate: existing });
        }

        const certificate = await prisma.certificate.create({
            data: {
                userId: user.id,
                courseId,
                certificateNumber: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                completionDate: new Date(),
                issueDate: new Date()
            }
        });

        return NextResponse.json({ certificate });
    } catch (error) {
        console.error("[CERTIFICATE_GENERATE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
