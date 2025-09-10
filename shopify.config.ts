import { DeliveryMethod, LATEST_API_VERSION, shopifyApi, } from "@shopify/shopify-api";
import '@shopify/shopify-api/adapters/web-api';
import { NextRequest } from "next/server";

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_CLIENT_ID!,
    apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET!,
    scopes: ['read_orders', 'read_products', 'read_customers'],
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
    const rawBody = await req.text();

    //validate the webhook
    const result = await shopify.webhooks.validate({
        rawBody: rawBody,
        rawRequest: req,
        rawResponse: new Response(),
    });

    if (!result.valid) {
        return { valid: false, topic: null, domain: null, data: null };
    }

    const { topic, domain } = result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;

    try {
        data = JSON.parse(rawBody);
    } catch (e) {
        console.error("Invalid JSON in webhook:", e);
    }

    return { valid: true, topic, domain, data };
}

export default shopify;