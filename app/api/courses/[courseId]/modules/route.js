import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { courseId } = await params;

        const modules = await prisma.module.findMany({
            where: { courseId },
            include: { lessons: true },
            orderBy: { order: 'asc' }
        });

        return NextResponse.json(modules);
    } catch (error) {
        console.error("[MODULES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();
        const { title, description, order } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const courseOwner = await prisma.course.findUnique({
            where: { id: courseId, instructorId: user.id }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const module = await prisma.module.create({
            data: {
                title,
                description,
                order,
                courseId
            }
        });

        return NextResponse.json(module);
    } catch (error) {
        console.error("[MODULES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
