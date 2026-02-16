import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { sessionId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const session = await prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: { orderBy: { createdAt: 'asc' } }
            }
        });

        if (!session) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(session);
    } catch (error) {
        console.error("[CHAT_SESSION_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
