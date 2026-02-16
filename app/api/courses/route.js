import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const level = searchParams.get("level");
        const search = searchParams.get("search");

        const where = {
            isPublished: true,
        };

        if (category) where.category = category;
        if (level) where.level = level;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const courses = await prisma.course.findMany({
            where,
            include: {
                instructor: {
                    select: { firstName: true, lastName: true, imageUrl: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ courses });
    } catch (error) {
        console.error("[COURSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description, category, level } = await req.json();

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const course = await prisma.course.create({
            data: {
                title,
                description,
                category,
                level,
                slug: `${slug}-${Math.random().toString(36).substring(2, 7)}`,
                instructorId: user.id
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("[COURSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
