import Order from "@/models/orderModel";
import Shop from "@/models/shopModel";
import { OrderStatus } from "@/types/OrderType";

export async function fetchMerchantMapData({ merchantId }: { merchantId: string }) {
    //pull the shop associated with the merchant
    const shops = await Shop.distinct('_id', { owner: merchantId, }).lean();

    if (!shops || shops.length === 0) {
        return [];
    }

    //pull the orders those are not delivered
    const orders = await Order.find({
        shopId: { $in: shops },
        status: {
            $nin: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
        }
    })
        .select({
            _id: false,
            order_id: true,
            city: true,
            address: true,
            asignee: true,
            status: true,
            latitude: true,
            longitude: true
        })
        .populate('asignee', 'name').lean();

    return orders;
}


export async function changeOrderLocation({ orderId, latitude, longitude }: { orderId: string, latitude: number, longitude: number }) {

    const order = await Order.findOne({ order_id: parseInt(orderId) });

    if (!order) {
        return { ok: false, message: 'Order not found' };
    }

    order.latitude = latitude;
    order.longitude = longitude;

    await order.save();

    return { ok: true, message: 'Order coordinates updated successfully' };
}