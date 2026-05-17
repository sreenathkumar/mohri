'use server'

import { auth } from "@/auth";
import dbConnect from "@/dbConnect";
import Shop from "@/models/shopModel";
import { redirect } from "next/navigation";
import * as jose from 'jose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function connectShop (initialState: any, formData: FormData){
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    const userId = session.user.id;
    const url = formData.get('url') as string;
    const platform = formData.get('platform') as string;


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

    if (platform === 'shopify') {
        const shopifyUrl = new URL('/api/connect/shopify/auth', `https://${process.env.NEXT_PUBLIC_SHOPIFY_HOST}`);

        const parsedUrl = new URL(url);
        const shopDomain = parsedUrl.hostname;
        shopifyUrl.searchParams.append('shop', shopDomain); //pass shop url
        shopifyUrl.searchParams.append('uid', userId) //pass shop owner id

        //connect to db
        await dbConnect()

        //check if the shop is already connected
        const isConnected = await Shop.findOne({
            domain: shopDomain,
        });

        if (isConnected) {
            return {
                success: false,
                message: "Shop is already connected.",
            }
        }

        // Redirect the user to the Shopify OAuth URL
        redirect(shopifyUrl.toString());
    }
    return { success: true, message: "Shop connected successfully.", };
}

export async function connectShopifyStore(token: string | null) {
    if (!token) {
        return {
            success: false,
            message: 'Token is required for validation.',
        }
    }

    try {
        const session = await auth();

        if (!session || !session.user) {
            redirect('/login');
        }

        const userId = session.user.id;
        const secret = new TextEncoder().encode(process.env.SHOPIFY_CLIENT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);

        await dbConnect();

        //create the shop DB entrry
        const result = await Shop.create({
            user: userId,
            domain: payload.domain,
            platform: payload.platform,

        });

        if (result) {
            return {
                success: true,
                message: 'Store connected successfully'
            }
        }

        return {
            success: false,
            message: 'Failed connecting store.',
        }
    } catch (error: any) {
        console.log(error.message);
        return {
            success: false,
            message: error.message,
        }
    }
}
