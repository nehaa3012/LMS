import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const enrollment = await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId
            }
        });

        return NextResponse.json(enrollment);
    } catch (error) {
        console.error("[COURSE_ENROLL_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
