import dbConnect from "@/dbConnect";
import Order from "@/models/orderModel";
import { DriverOrderType } from "@/types/OrderType";
import { OrderStatus } from "@/types/OrderType";


export async function fetchDriverOrders(driverId: string): Promise<DriverOrderType[]> {
    await dbConnect();

    //fetch to db
    const orders = await Order.find({ asignee: driverId })
        .select('order_id name city address phone payment amount status date_delivered assignedAt -_id')
        .sort({ createdAt: -1 })
        .lean<DriverOrderType[]>();

    return orders;
}




export async function mutateDeliveryStatus({ order_id, status, userId }: { order_id: number, status: OrderStatus, userId: string }) {
    if (!order_id) return null

    await dbConnect();

    if (status === OrderStatus.OUT_FOR_DELIVERY) {
        //find the existing out-for-delivery order for the driver and make it processing
        await Order.findOneAndUpdate({ asignee: userId, status: OrderStatus.OUT_FOR_DELIVERY }, {
            status: OrderStatus.PROCESSING
        });
    }

    const updatedOrder = await Order.findOneAndUpdate({ order_id }, {
        status,
        date_delivered: Date.now()
    }, { new: true }).select('-_id').lean<DriverOrderType>();

    return updatedOrder;
}