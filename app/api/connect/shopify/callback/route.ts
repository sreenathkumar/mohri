//import '@shopify/shopify-api/adapters/web-api';
import { auth } from "@/auth";
import dbConnect from "@/dbConnect";
import Shop from "@/models/shopModel";
import shopify from "@/shopify.config";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    try {
        //get the access token and save it to the database
        const { session } = await shopify.auth.callback({
            rawRequest: req,
            rawResponse: new Response(),
        });

        if (!session) {
            return new Response('No session found', { status: 400 });
        }

        const userSession = await auth()

        await dbConnect();
        //save the token to the database
        await Shop.findOneAndUpdate(
            { url: session.shop },
            { user: userSession?.user?.id, accessToken: session.accessToken },
            { upsert: true }
        );

        return Response.redirect(new URL("/stores", `http://localhost:3000`), 302);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error during Shopify callback processing:', error.message);
        return new Response('Callback processing failed', { status: 500 });
    }
}