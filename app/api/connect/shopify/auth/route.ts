//
import dbConnect from "@/dbConnect";
import { getCookieValue } from "@/lib/utils";
import { AuthNonce } from "@/models/authNonce";
import shopify from "@/shopify.config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // Ensure the shop parameter is present
    const shop = req.nextUrl.searchParams.get('shop');
    const uid = req.nextUrl.searchParams.get('uid');

    if (!shop || !uid) {
        return new Response('Missing shop/uid parameter', { status: 400 });
    }

    try {
        const response = await shopify.auth.begin({
            shop: shop || '',
            callbackPath: '/api/connect/shopify/callback',
            isOnline: false,
            rawRequest: req,
            rawResponse: new NextResponse(),
        });

        const headers: Headers = response.headers;
        const state = getCookieValue(headers, 'shopify_app_state');

        if (!state) {
            return new Response('Missing state cookie', { status: 400 });
        }

        // Save the state ant user id to the database
        await dbConnect();
        const newNonce = new AuthNonce({
            nonce: state,
            userId: uid,
        });
        await newNonce.save();

        return response
    } catch (error) {
        console.error('Error during Shopify authentication:', error);
        return new Response('Authentication failed', { status: 500 });
    }
}