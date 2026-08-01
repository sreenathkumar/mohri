import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Basic session fetcher for Server Components and layouts (doesn't throw errors)
 */
export const getServerSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});

export interface SessionContextOptions {
    allowedRoles?: string[];
}

/**
 * Strict context resolver for Server Actions (validates session, active org, and roles)
 */
export async function getRequiredSessionContext(options?: SessionContextOptions) {
    const sessionData = await getServerSession();

    if (!sessionData || !sessionData.user) {
        throw new Error("Unauthorized: User session not found. Please log in.");
    }

    const organizationId = sessionData.session.activeOrganizationId;
    const role = sessionData.session.role;

    if (!organizationId) {
        throw new Error("Bad Request: Active organization ID is missing in the session.");
    }

    // Guard against specific forbidden roles if options are passed
    if (options?.allowedRoles && !options.allowedRoles.includes(role)) {
        throw new Error(`Forbidden: Role '${role}' is not authorized to perform this action.`);
    }

    return {
        user: sessionData.user,
        session: sessionData.session,
        userId: sessionData.user.id,
        organizationId,
        role,
    };
}


export const getOrgSlug = cache(async (userId: string) => {
    const org = await auth.api.getFullOrganization({
        headers: await headers(),
    });
    return org?.slug;
})