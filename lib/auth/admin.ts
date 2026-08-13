import { currentUser } from "@clerk/nextjs/server";

export async function getAdminUser() {
    const user = await currentUser();

    if (!user) return null;
    if (user.publicMetadata?.role !== "admin") return null;

    return user;
}
