import { prisma } from "@/lib/prisma";

export interface FetchDriversParams {
    organizationId: string;
}

export interface MutateEmployeeParams {
    id: string; // The User ID or Member ID depending on target
    organizationId: string;
    data: {
        name?: string;
        email?: string;
        role?: "owner" | "manager" | "driver";
    };
}

/**
 * Fetch all drivers belonging to a specific organization
 */
export async function getDrivers({ organizationId }: FetchDriversParams) {
    if (!organizationId) return [];

    const members = await prisma.member.findMany({
        where: {
            organizationId,
            role: "driver",
        },
        select: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                },
            },
        },
    });

    return members.map((member) => member.user);
}

/**
 * Update user details and organization member role
 */
export async function mutateEmployee({ id, organizationId, data }: MutateEmployeeParams) {
    if (!id || !organizationId) {
        return null
    }

    const { role, name, email } = data;

    //Update User Profile details (name/email) if provided
    if (name || email) {
        await prisma.user.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
        });
    }

    // Update Member Role within the specific Organization
    if (role) {
        await prisma.member.updateMany({
            where: {
                userId: id,
                organizationId,
            },
            data: {
                role,
            },
        });
    }
    return null
}