import { prisma } from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress;

    return prisma.user.upsert({
        where: {
            clerkId: user.id,
        },
        update: {
            email,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
        },
        create: {
            clerkId: user.id,
            email,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
        },
    });
}