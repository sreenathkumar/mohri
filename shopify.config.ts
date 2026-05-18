import { DeliveryMethod, LATEST_API_VERSION, shopifyApi, } from "@shopify/shopify-api";
import '@shopify/shopify-api/adapters/web-api';
import { NextRequest } from "next/server";
import crypto from 'crypto'
import { buffer } from "stream/consumers";

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_CLIENT_ID!,
    apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET!,
    scopes: ['read_orders', 'read_products', 'read_customers'],
    hostName: process.env.NEXT_PUBLIC_SHOPIFY_HOST!,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
})

//webhook handlers
shopify.webhooks.addHandlers({
    PRODUCTS_CREATE: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/api/webhook/shopify',
    }],
    ORDERS_CREATE: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/api/webhook/shopify',
    }],
    ORDERS_PAID: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/api/webhook/shopify',
    }],
    ORDERS_DELETE: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/api/webhook/shopify',
    }],
    ORDERS_CANCELLED: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/api/webhook/shopify',
    }],
    APP_UNINSTALLED: [{
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: '/api/connect/shopify/uninstall',
    }]
});

//verify the webhook request
export async function verifyWebhook(req: NextRequest) {
    if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
        console.log('not env var')
        return {valid: false}
    }

    const signature = req.headers.get('X-Signature');
    const rawbody = await req.text();

    if(!signature){
        console.log('no signature')
        return {valid: false}
    }
    const expected = crypto.createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET).update(rawbody).digest('hex');
    const isValidSignature = crypto.timingSafeEqual(
        Buffer.from(expected),
        Buffer.from(signature)
    );

    if(!isValidSignature){
        console.log('not valid signature')
        return {valid: false}
    }

    //extract the data 
    const {topic, shop, payload} = JSON.parse(rawbody);

    return{
        valid: true, 
        topic, 
        shop, 
        data: payload
    }
}

export default shopify;