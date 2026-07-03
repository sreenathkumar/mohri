'use client'

import { Checkbox } from "@/components/shadcn/checkbox";
import { useClipboardCopy } from "@/context/ClipboardCtx";
import { generateClipboardText } from "@/lib/clipboardText";
import { formatDate } from "date-fns";
import { useEffect } from "react";
import { OrderStatus } from "@/types/OrderType";

interface SelectOrderProps {
    status?: OrderStatus.PROCESSING | OrderStatus.DELIVERED
    order: string;
}

function SelectOrder({ status, order }: SelectOrderProps) {
    const { clipboardContent, setClipboardContent, clearClipboard } = useClipboardCopy();

    const parsedOrder = JSON.parse(order);
    const { order_id, date_delivered } = parsedOrder;

    //check if the delivery date is there 
    if (date_delivered && date_delivered !== null) {
        parsedOrder.date_delivered = formatDate(new Date(date_delivered), 'PPpp')
    } else {
        delete parsedOrder.date_delivered;
    }

    const text = generateClipboardText(parsedOrder);

    const isExist = clipboardContent.ids.includes(order_id);

    useEffect(() => {
        clearClipboard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCheckboxChange = () => {
        if (isExist) {
            setClipboardContent(prev => {
                const isSameStaus = prev.status === status;
                const newIds = prev.ids.filter(id => id !== order_id);
                const lines = prev.text?.split('\n\n').filter(block => !block.includes(`#${order_id}`));
                return {
                    ...prev,
                    ids: newIds,
                    text: lines?.join('\n\n'),
                    status: isSameStaus ? prev.status : status
                }
            })
        } else {
            setClipboardContent(prev => {
                const isSameStaus = prev.status === status;
                const hasExistingText = prev.text && prev.text.trim().length > 0;
                return {
                    ...prev,
                    ids: [...prev.ids, order_id],
                    text: hasExistingText ? prev.text?.trim() + '\n\n' + text : text,
                    status: isSameStaus ? prev.status : status,
                }
            });
        }
    }

    return (
        <Checkbox onCheckedChange={handleCheckboxChange} checked={isExist} />
    )
}



export default SelectOrder