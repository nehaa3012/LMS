import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const certificates = await prisma.certificate.findMany({
            where: { userId: user.id },
            include: { course: true },
            orderBy: { issueDate: 'desc' }
        });

        return NextResponse.json({ certificates });
    } catch (error) {
        console.error("[CERTIFICATES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
