import { prisma } from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress;

    // Use fullName or construct from firstName and lastName
    const name = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || email?.split("@")[0] || "User";

    return prisma.user.upsert({
        where: {
            clerkId: user.id,
        },
        update: {
            name,
            email, // Keep email in sync
        },
        create: {
            clerkId: user.id,
            email,
            name,
        },
    });
}