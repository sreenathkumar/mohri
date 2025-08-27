'use server'

import { redirect } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectShop = async (initialState: any, formData: FormData) => {
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
        console.log("Initiating Shopify OAuth flow for URL:", url);
        const shopifyUrl = new URL('/api/connect/shopify/auth', `https://${process.env.SHOPIFY_HOST}`);
        const parsedUrl = new URL(url);
        const shopDomain = parsedUrl.hostname;
        shopifyUrl.searchParams.append('shop', shopDomain);

        // Redirect the user to the Shopify OAuth URL
        redirect(shopifyUrl.toString());
    }

    // Here you would typically add logic to save the shop details to your database
    // For example:
    // await Shop.create({ url, platform, user: userId });

    return { success: true, message: "Shop connected successfully." };
}

export default connectShop