import { prisma } from "@/lib/prisma";
import { Platform } from "@prisma/client";

export interface UpdateShopInput {
    name?: string;
    accessToken?: string;
    platform?: Platform;
}

export interface UpdateShopParams {
    domain: string;
    organizationId: string;
    data: UpdateShopInput;
}


export interface DeleteShopParams {
    domain: string;
    organizationId: string;
}

/**
 * Fetch all connected shops for an organization
 */
export async function fetchShops({ organizationId }: { organizationId: string }) {
    if (!organizationId) return [];

    return await prisma.shop.findMany({
        where: {
            organizationId,
        },
        select: {
            domain: true,
            platform: true,
            name: true,
        },
    });
}

/**
 * Update a shop's details scoped to an organization
 */
export async function mutateShop({ domain, organizationId, data }: UpdateShopParams) {
    if (!domain || !organizationId || Object.keys(data).length === 0) {
        throw new Error("[mutateShop] : Domain, organization, and updated data are required.");
    }

    await prisma.shop.update({
        where: { domain: domain, organizationId: organizationId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.platform && { platform: data.platform }),
        },
    });
}

/**
 * Delete a shop scoped to an organization
 */
export async function deleteShop({ domain, organizationId }: DeleteShopParams) {
    if (!domain || !organizationId) {
        throw new Error("[deleteShop] : Domain and organization are required to delete the shop.");
    }

    await prisma.shop.delete({
        where: {
            organizationId,
            domain,
        },
        select: { id: true },
    });

}