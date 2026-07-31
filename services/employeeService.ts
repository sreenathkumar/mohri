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
 * Fetch all employees belonging to a specific organization
 * @param organizationId - The ID of the organization
 * @returns Array of employees with their user details
 */
export async function fetchEmployees({ organizationId }: FetchDriversParams) {
    if (!organizationId) return [];

    const members = await prisma.member.findMany({
        where: {
            organizationId,
        },
        select: {
            role: true,
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

    return members.map((member) => ({
        role: member.role,
        ...member.user
    }));
}

/**
 * Fetch all drivers belonging to a specific organization
 */
export async function fetchDrivers({ organizationId }: FetchDriversParams) {
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
 * check if an employee with the given email exists in the specified organization
 */
export async function checkEmployeeExists({ email, organizationId }: { email: string, organizationId: string }) {
    if (!email || !organizationId) {
        throw new Error("Email and organizationId are required to check employee existence.");
    }

    const member = await prisma.member.findFirst({
        where: {
            organizationId,
            user: {
                email,
            },
        },
        select: {
            id: true,
            user: true,
            organizationId: true,
            role: true,
        }
    });

    return member !== null;
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
