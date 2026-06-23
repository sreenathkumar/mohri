import dbConnect from "@/dbConnect";
import verifySignature from "@/lib/verifyWebhook";
import Order from "@/models/orderModel";

export async function POST(request: Request) {
    try {
        const isAuthenticated = await verifySignature(request, process.env.OD_WC_WEBHOOK);

        if (!isAuthenticated) {
            console.error('Webhook authentication failed');
            return new Response('Webhook unauthenticated', {
                status: 200,
            })
        }

        const res = await request.json();

        if (res) {
            const order_id = res.id;
            if (order_id) {
                await dbConnect();

                const result = await Order.deleteOne({ order_id });

                if (result.deletedCount > 0) {
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/updates`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "DELETE_ORDER", order_id: order_id })
                    })

                    return new Response(`[Action]: delete. [Message]: #${order_id} is deleted successfully.`, { status: 200 })
                } else {
                    return new Response(`[Action]: delete. [Message]: #${order_id} deletion failed.`, { status: 400 });
                }
            }

        }

        console.log('Error happened because there is no req data from webhook or something unexpected happened.')

        return new Response('Something unexpected happened.', { status: 400 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('Something error in deleted webhook: ', error.message);
        return new Response(`Order update webhook error: ${error?.message}`, { status: 400 })
    }

}