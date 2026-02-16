import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const { userId } = await auth();
        const { courseId, lessonId } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const session = await prisma.studySession.create({
            data: {
                userId: user.id,
                courseId,
                lessonId,
                isActive: true
            }
        });

        return NextResponse.json({ session });
    } catch (error) {
        console.error("[STUDY_SESSION_START_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
