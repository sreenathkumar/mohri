'use client'

import { Checkbox } from "@/components/shadcn/checkbox";
import { useClipboardCopy } from "@/context/ClipboardCtx";
import { generateClipboardText } from "@/lib/clipboardText";
import { isSameArray } from "@/lib/utils";
import { DriverOrderType } from "@/types/OrderType";
import { OrderStatus } from '@lib/prisma';
import { formatDate } from "date-fns";



interface CheckAllProps {
    orders: DriverOrderType[]
}
function CheckAll({ orders }: CheckAllProps) {
    const { clipboardContent, setClipboardContent, clearClipboard } = useClipboardCopy()

    //const parsedOrders = JSON.parse(orders);
    const ids = orders.map((order: DriverOrderType) => order.order_id);
    let clipboardText = '';
    let clipboardStatus: OrderStatus[] = [];

    const isSame = isSameArray(ids, clipboardContent.ids)


    orders.forEach((order: any, index: number) => {
        const { date_delivered } = order;

        //check if the delivery date is there 
        if (date_delivered && date_delivered !== null) {
            order.date_delivered = formatDate(new Date(date_delivered), 'PPpp')
        } else {
            delete order.date_delivered;
        }

        if (clipboardText.length === 0) {
            clipboardText = generateClipboardText(order)
        } else {
            clipboardText += `${generateClipboardText(order)}${index !== orders.length && '\n\n'}`
            if (!clipboardStatus.includes(order.status)) {
                clipboardStatus.push(order.status)
            }
        }

    })

    const handleCheck = () => {
        if (isSame) {
            clearClipboard()
        } else {
            setClipboardContent({
                text: clipboardText,
                ids: ids,
                status: clipboardStatus.join(',') as OrderStatus
            })
        }
    }

    return (
        <Checkbox onCheckedChange={handleCheck} checked={isSame} className="border-muted-foreground/30 cursor-pointer" />
    )
}

export default CheckAll