'use server'

import { auth } from "@/auth";
import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectShop = async (initialState: any, formData: FormData) => {
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
        }
    }

    if (platform === 'shopify') {
        const shopifyUrl = new URL('/api/connect/shopify/auth', `https://${process.env.SHOPIFY_HOST}`);

        const parsedUrl = new URL(url);
        const shopDomain = parsedUrl.hostname;
        shopifyUrl.searchParams.append('shop', shopDomain); //pass shop url
        shopifyUrl.searchParams.append('uid', userId) //pass shop owner id

        // Redirect the user to the Shopify OAuth URL
        redirect(shopifyUrl.toString());
    }
    return { success: true, message: "Shop connected successfully." };
}

export default connectShop