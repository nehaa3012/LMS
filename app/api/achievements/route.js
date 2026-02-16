import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: { achievements: { include: { achievement: true } } }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const allAchievements = await prisma.achievement.findMany();
        const unlockedIds = user.achievements.map(ua => ua.achievementId);

        const unlocked = user.achievements.map(ua => ua.achievement);
        const locked = allAchievements.filter(a => !unlockedIds.includes(a.id));

        // Simple progress mapping (example)
        const progress = {
            courses_completed: await prisma.enrollment.count({ where: { userId: user.id, status: 'COMPLETED' } }),
            lessons_completed: await prisma.progress.count({ where: { userId: user.id, isCompleted: true } }),
            points: user.totalPoints
        };

        return NextResponse.json({ unlocked, locked, progress });
    } catch (error) {
        console.error("[ACHIEVEMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
