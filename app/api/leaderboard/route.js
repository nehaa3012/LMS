import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Simplified leaderboard for now: top users by points
        const users = await prisma.user.findMany({
            take: limit,
            orderBy: { totalPoints: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                imageUrl: true,
                totalPoints: true,
                streak: true,
                _count: {
                    select: { enrollments: { where: { status: 'COMPLETED' } } }
                }
            }
        });

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl
            },
            points: user.totalPoints,
            streak: user.streak,
            coursesCompleted: user._count.enrollments
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("[LEADERBOARD_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
