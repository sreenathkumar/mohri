import { OrderType } from "@/types/OrderType";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

export const wooApi = new WooCommerceRestApi({
    url: process.env.WOO_API_URI || "",
    consumerKey: process.env.WOO_KEY || "",
    consumerSecret: process.env.WOO_SECRET || "",
    version: "wc/v3"
});

interface ExtendedOrderType extends OrderType {
    date_created_gmt: string;
    date_modified_gmt: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareOrder = (order: any) => {
    if (!order) return null;

    const { id, total, billing, payment_method, date_created_gmt, date_modified_gmt } = order;

    return {
        order_id: id || '',
        amount: total || '',
        name: billing?.first_name || '',
        city: billing?.state || '',
        address: billing?.address_1 || '',
        phone: billing?.billing_phone_2 || '',
        payment: payment_method || '',
        date_created_gmt: date_created_gmt || '',
        date_modified_gmt: date_modified_gmt || '',
        status: 'processing',
        asignee: null,
    } satisfies ExtendedOrderType

}