import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRecommendations } from "@/lib/ai/recommendations";

export async function GET(req, { params }) {
    try {
        const { courseId } = await params;
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const recommendations = await getRecommendations(userId, courseId);

        return NextResponse.json(recommendations);
    } catch (error) {
        console.error("[COURSE_RECOMMENDATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
