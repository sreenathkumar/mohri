import dbConnect from "@/dbConnect";
import Shop from "@/models/shopModel";
import { verifyWebhook } from "@/shopify.config";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    //check if the request is verified
    const { valid, domain } = await verifyWebhook(request);

    if (!valid) {
        return new Response("Unauthorized. HMAC don't match.", { status: 401 });
    }
    //connect to the database
    await dbConnect();

    //delete the shop from the database
    const result = await Shop.deleteOne({
        url: domain,
    })

    if (result.deletedCount === 0) {
        return new Response("Shop not found", { status: 404 });
    }

    return new Response('Database cleared', { status: 200 });
}