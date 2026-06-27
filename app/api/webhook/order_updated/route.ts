import { prepareOrder } from "@/actions/integration/wooConfig";
import dbConnect from "@/dbConnect";
import verifySignature from "@/lib/verifyWebhook";
import Order from "@/models/orderModel";

export async function POST(request: Request) {
    const isAuthenticated = await verifySignature(request, process.env.OU_WC_WEBHOOK);

    if (!isAuthenticated) {
        console.error('Webhook authentication failed');
        return new Response('Webhook unauthenticated', {
            status: 200,
        })
    }
    try {
        const res = await request.json();

        if (res) {
            await dbConnect();

            //get the order id and updated status
            const { id, status, } = res

            if (status === 'cancelled') {
                const res = await Order.deleteOne({ order_id: id });

                if (res.deletedCount > 0) {
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/updates`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "DELETE_ORDER", order_id: id })
                    })

                    return new Response(`[Action]: cancelled. [Message]: #${id} is deleted successfully. `, { status: 200 })
                }
                console.log('cancel block. error because order not deleted.')

                return new Response(`[Action]: cancelled. [Message]: #${id} deletion from DB failed. `, { status: 400 })
            }

            if (status === 'completed') {
                const res = await Order.updateOne({ order_id: id }, { status: "completed" });

                if (res) {
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/updates`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "COMPLETE_ORDER", order_id: id })
                    })

                    return new Response(`[Action]: completed. [Message]: #${id} is updated successfully. `, { status: 200 })
                }
                console.log('complete block. error because order not updated.')

                return new Response(`[Action]: completed. [Message]: #${id} update from DB failed. `, { status: 400 })
            }

            if (['processing', 'hold'].includes(status)) {
                const modifiedOrder = prepareOrder(res);

                if (!modifiedOrder) {
                    console.log('error because prepared order not found.')
                    return new Response(`Error in getting the prepared order data of order_id: ${id}`, { status: 400 })
                }

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { order_id, status, asignee, ...rest } = modifiedOrder

                const result = await Order.findOneAndUpdate({ order_id: id }, { ...rest });

                if (result) {
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/updates`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type: "UPDATE_ORDER", data: result })
                    })

                    return new Response(`[Action]: update. [Message]: #${id} is updated successfully.`, { status: 200 })
                }
                console.log('order not updated. status block')
                return new Response(`[Action]: update. [Message]: #${id} update from DB failed. `, { status: 400 })

            }
        }

        console.log('no condition met or no response')
        return new Response('Order update webhook error', { status: 400 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return new Response(`Order update webhook error: ${error?.message}`, { status: 400 })
    }
}