//
import shopify from "@/shopify.config";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    // Ensure the shop parameter is present
    const shop = req.nextUrl.searchParams.get('shop');
    if (!shop) {
        return new Response('Missing shop parameter', { status: 400 });
    }

    try {
        const response = await shopify.auth.begin({
            shop: shop || '',
            callbackPath: `/api/connect/shopify/callback`,
            isOnline: false,
            rawRequest: req,
            rawResponse: new Response(),
        });

        return response
    } catch (error) {
        console.error('Error during Shopify authentication:', error);
        return new Response('Authentication failed', { status: 500 });
    }
}