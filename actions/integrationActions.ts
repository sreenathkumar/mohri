'use server'

import { getRequiredSessionContext } from "@/lib/auth-context";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function connectShop(initialState: any, formData: FormData) {
    const url = formData.get('url') as string;
    const platform = formData.get('platform') as string;
    const parsedUrl = new URL(url);
    const shopDomain = parsedUrl.hostname;

    if (!url || !platform) {
        console.log("Missing parameters:", { url, platform });
        return {
            success: false,
            message: "All parameters are required to connect a shop.",
            errors: {
                url: !url ? "Shop URL is required." : undefined,
                platform: !platform ? "Shop platform is required." : undefined
            }
        }
    }

    const { organizationId } = await getRequiredSessionContext({
        allowedRoles: ['owner', 'manager']
    })

    if (platform === 'shopify') {
        //check if the shop is already connected
        const isConnected = await prisma.shop.findFirst({
            where: {
                domain: shopDomain,
            }
        });

        if (isConnected) {
            return {
                success: false,
                message: "Shop is already connected.",
            }
        }

        //get the shopify oauth url
        const shopifyUrl = await connectShopifyStore({ shopDomain, organizationId });

        // Redirect the user to the Shopify OAuth URL
        redirect(shopifyUrl.toString());
    }
    return { success: true, message: "Shop connected successfully.", };
}

interface ConnectShopifyStoreParams {
    shopDomain: string,
    organizationId: string
}
async function connectShopifyStore({ shopDomain, organizationId }: ConnectShopifyStoreParams) {
    if (!shopDomain || !organizationId) {
        console.error('Missing parameters in connectShopifyStore:', { shopDomain, organizationId });
        throw new Error('Missing parameters in connectShopifyStore');
    }

    if (!process.env.SHOPIFY_CLIENT_ID) {
        console.error('SHOPIFY_CLIENT_SECRET is not defined in the environment variables');
        throw new Error('Some went wrong in the backend. Please try again later.');
    }

    if (!process.env.SHOPIFY_CLIENT_SECRET) {
        console.error('SHOPIFY_CLIENT_SECRET is not defined in the environment variables');
        throw new Error('Some went wrong in the backend. Please try again later.');
    }

    const nonce = crypto.randomUUID();

    //save the nonce in the database with the shop domain and expiration time
    await prisma.shopifyNonce.upsert({
        where: {
            shop: shopDomain
        },
        update: {
            nonce,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
        },
        create: {
            nonce,
            organizationId,
            shop: shopDomain,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
        }
    });

    // Construct the Shopify OAuth URL
    const params = new URLSearchParams({
        nonce,
        shop: shopDomain,
    });

    return `https://${process.env.NEXT_PUBLIC_SHOPIFY_HOST}/api/connect?${params.toString()}`;
}