import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
    try {
        const { certificateId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const certificate = await prisma.certificate.findUnique({
            where: { id: certificateId },
            include: {
                course: { include: { instructor: true } },
                user: true
            }
        });

        if (!certificate) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json({ certificate });
    } catch (error) {
        console.error("[CERTIFICATE_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
