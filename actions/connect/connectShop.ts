'use server'

import { auth } from "@/auth";
import dbConnect from "@/dbConnect";
import Shop from "@/models/shopModel";
import { redirect } from "next/navigation";
import * as jose from 'jose';
import { createHmac, randomBytes } from "crypto";
import AuthCode from "@/models/oauthCode";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function connectShop (initialState: any, formData: FormData){
    const session = await auth();

    if (!session || !session.user) {
        redirect('/login');
    }

    const userId = session.user.id;
    const url = formData.get('url') as string;
    const platform = formData.get('platform') as string;


    if (!url || !platform) {
        console.log("Missing parameters:", { url, platform });
        return {
            success: false,
            message: "All parameters are required to connect a shop.",
            errors: {
                url: !url ? "Shop URL is required." : undefined,
                platform: !platform ? "Shop platform is required." : undefined
            }
        }
    }

    if (platform === 'shopify') {
        const shopifyUrl = new URL('/api/connect/shopify/auth', `https://${process.env.NEXT_PUBLIC_SHOPIFY_HOST}`);

        const parsedUrl = new URL(url);
        const shopDomain = parsedUrl.hostname;
        shopifyUrl.searchParams.append('shop', shopDomain); //pass shop url
        shopifyUrl.searchParams.append('uid', userId) //pass shop owner id

        //connect to db
        await dbConnect()

        //check if the shop is already connected
        const isConnected = await Shop.findOne({
            domain: shopDomain,
        });

        if (isConnected) {
            return {
                success: false,
                message: "Shop is already connected.",
            }
        }

        // Redirect the user to the Shopify OAuth URL
        redirect(shopifyUrl.toString());
    }
    return { success: true, message: "Shop connected successfully.", };
}

interface ShopConnectionParams{
    state: string,
    challenge: string,
    shop: string
}
export async function confirmShopConnection({state, challenge, shop}:ShopConnectionParams){
    //if params is empty return nothing
    if(!state || !challenge || !shop){
        return {
            success: false,
            message: 'No params is provided'
        }
    }

    try {
        const session = await auth();
        
        if(!session){
            return {
                success: false,
                message: 'Please login.'
            }
        }

        //connect to db
        await dbConnect();

        //check if the shop is already connected or not.
        const isConnected = await Shop.findOne({
            domain: shop
        }).catch(()=>null);

        if (isConnected) {
            return{
                success: false,
                message: 'The shop is already connected to an account.'
            }
        }

       const code = randomBytes(16).toString('hex');
    
    const result = await AuthCode.create({
        code,
        challenge,
        shop
    }).catch(()=>null); 

    if (!result) {
        return{
            success: false,
            message: 'Error in saving AuthCode'
        }
    }

    //sign a request and send it to the platform's server.
    const body = JSON.stringify({code, state, userId:session.user.id});
    const timestamp = Date.now().toString();

    const signature = createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!).update(`${timestamp}.${body}`).digest('hex');

    //send the request
    const platformRes = await fetch(`https://${process.env.NEXT_PUBLIC_SHOPIFY_HOST}/api/connect/callback`,{
        method: 'POST',
        headers:{
            'content-type': 'application/json',
            'x-service-timestamp': timestamp,
            'x-service-signature': signature
        },
        body
    });

    const resMessage = await platformRes.text();

    return{
        success: platformRes.ok,
        message: resMessage
    }

    } catch (error:any) {
        console.log('Error when confirming shop connection', error.message);
        return {
            success: false,
            message: `Something goes wrong in connecting shop: ${error.message}`
        }
    }
    

}