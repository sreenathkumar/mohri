import { DeliveryMethod, LATEST_API_VERSION, shopifyApi, } from "@shopify/shopify-api";
import '@shopify/shopify-api/adapters/web-api';
import crypto from "crypto";
import { NextRequest } from "next/server";

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_CLIENT_ID!,
    apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET!,
    scopes: ['read_orders, read_products'],
    hostName: process.env.SHOPIFY_HOST!,
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
    const hmac = req.headers.get("x-shopify-hmac-sha256") || "";
    const domain = req.headers.get("x-shopify-shop-domain");
    const topic = req.headers.get("x-shopify-topic");
    let valid = false;

    if (!hmac) {
        return { valid, topic, domain };
    }

    const body = await req.text();

    //compute the HMAC
    const digest = crypto
        .createHmac("sha256", process.env.SHOPIFY_CLIENT_SECRET!)
        .update(body, "utf8")
        .digest("base64");

    valid = crypto.timingSafeEqual(Buffer.from(digest, 'base64'), Buffer.from(hmac, 'base64'));

    return { valid, topic, domain };
}

export default shopify;