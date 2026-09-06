import { NextRequest } from "next/server";
import crypto from 'crypto'

async function verifyWebhook(req: NextRequest) {
    if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
        console.log('not env var')
        return { valid: false }
    }

    const signature = req.headers.get('X-Signature');
    const rawbody = await req.text();

    if (!signature) {
        console.log('no signature')
        return { valid: false }
    }
    const expected = crypto.createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET).update(rawbody).digest('hex');
    const isValidSignature = crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signature)
    );

    if (!isValidSignature) {
        console.log('not valid signature')
        return { valid: false }
    }

    //extract the data 
    const { topic, shopDomain, payload } = JSON.parse(rawbody);

    return {
        valid: true,
        topic,
        shopDomain,
        data: payload
    }
}

export default verifyWebhook;