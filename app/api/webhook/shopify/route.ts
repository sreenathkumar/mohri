import shopify from "@/shopify.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("Shopify Webhook received");
    const rawBody = await req.text();
    const { valid } = await shopify.webhooks.validate({
        rawBody,
        rawResponse: res,
        rawRequest: req
    });

    console.log("Webhook topic:", req.headers.get('x-shopify-topic'));
    //console.log("Shop domain:", domain);

    if (!valid) {
        console.error('Invalid webhook call, not handling it');
        return new Response("Invalid webhook", { status: 400 });
    }

    return new Response("Hello, Shopify Webhook!", { status: 200 });
}
