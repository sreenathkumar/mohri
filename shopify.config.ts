import { LATEST_API_VERSION, shopifyApi } from "@shopify/shopify-api";
import '@shopify/shopify-api/adapters/web-api';

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_CLIENT_ID!,
    apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET!,
    scopes: ['read_orders'],
    hostName: process.env.SHOPIFY_HOST!,
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
})

export default shopify;