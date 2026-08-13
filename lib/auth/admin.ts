import { currentUser } from "@clerk/nextjs/server";

/**
 * Returns the signed-in Clerk user only if they are flagged as an admin.
 *
 * An account is treated as an admin when its Clerk `publicMetadata.role`
 * is set to "admin". Set this in the Clerk Dashboard under
 * Users → (select user) → Metadata → Public, e.g. { "role": "admin" }.
 */
export async function getAdminUser() {
    const user = await currentUser();

    if (!user) return null;
    if (user.publicMetadata?.role !== "admin") return null;

    return user;
}
