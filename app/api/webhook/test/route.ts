import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    const signature = request?.headers?.get('X-WC-Webhook-Signature') || '';

    if (!signature) {
        return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    //check if the sceret is set
    const secret = process.env.TEST_WC_WEBHOOK;

    if (!secret) {
        return NextResponse.json({ error: 'Webhook secret is not defined' }, { status: 200 });
    }

    const rawBody = await request.text();

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64');

    // Check if the signature is valid
    const isValid = crypto.timingSafeEqual(
        Buffer.from(signature, 'base64'),
        Buffer.from(expectedSignature, 'base64')
    );

    console.log('isValid', isValid);

    if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 200 });
    }

    try {
        const res = request.body;

        console.log('Test webhook received:', res);

        return new Response('Test webhook received', {
            status: 200,
        });


    } catch (error: any) {
        console.log('Error in test webhook:', error.message)
        return new Response(`Webhook error: ${error.message}`, {
            status: 400,
        })
    }
}