import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();

        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: { lessons: true },
                    orderBy: { order: 'asc' }
                },
                instructor: {
                    select: { firstName: true, lastName: true, imageUrl: true }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        let isEnrolled = false;
        if (userId) {
            const user = await prisma.user.findUnique({ where: { clerkId: userId } });
            if (user) {
                const enrollment = await prisma.enrollment.findUnique({
                    where: { userId_courseId: { userId: user.id, courseId } }
                });
                isEnrolled = !!enrollment;
            }
        }

        return NextResponse.json({ course, isEnrolled });
    } catch (error) {
        console.error("[COURSE_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const course = await prisma.course.update({
            where: { id: courseId, instructorId: user.id },
            data: { ...values }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const course = await prisma.course.delete({
            where: { id: courseId, instructorId: user.id }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
