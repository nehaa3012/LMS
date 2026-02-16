import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const { userId } = await auth();
        const { sessionId } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const session = await prisma.studySession.findUnique({
            where: { id: sessionId }
        });

        if (!session || !session.isActive) {
            return new NextResponse("Session not found or already ended", { status: 404 });
        }

        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 1000);

        const updatedSession = await prisma.studySession.update({
            where: { id: sessionId },
            data: {
                endTime,
                duration,
                isActive: false
            }
        });

        // Award points (1 point per minute of study)
        const pointsEarned = Math.floor(duration / 60);
        if (pointsEarned > 0) {
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    totalPoints: { increment: pointsEarned }
                }
            });
        }

        return NextResponse.json({
            session: updatedSession,
            pointsEarned
        });
    } catch (error) {
        console.error("[STUDY_SESSION_END_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
