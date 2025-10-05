//import '@shopify/shopify-api/adapters/web-api';
import dbConnect from "@/dbConnect";
import { AuthNonce } from "@/models/authNonce";
import Shop from "@/models/shopModel";
import shopify from "@/shopify.config";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        //get the nonce from the cookie
        const nonce = req.nextUrl.searchParams.get('state')

        if (!nonce) {
            return new Response('Missing nonce cookie', { status: 400 });
        }

        //get the access token and save it to the database
        const { session } = await shopify.auth.callback({
            rawRequest: req,
            rawResponse: new Response(),
        });

        if (!session) {
            return new Response('No session found', { status: 400 });
        }

        //register webhooks after getting the access token
        const response = await shopify.webhooks.register({
            session,
        });

        if (!response) {
            return new Response('Webhook registration failed.')
        }

        await dbConnect();
        //find the nonce in the database and get the user id
        const authNonce = await AuthNonce.findOne({
            nonce: nonce
        })

        if (!authNonce) {
            return new Response('Invalid nonce', { status: 400 });
        }

        const userId = authNonce.userId;

        //save the token to the database
        await Shop.create({
            url: session.shop,
            accessToken: session.accessToken,
            user: userId,
            platform: 'shopify'
        });

        return Response.redirect(new URL("/stores", `https://${process.env.SHOPIFY_HOST}`), 302);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error during Shopify callback processing:', error.message);
        return new Response('Callback processing failed', { status: 500 });
    }
}