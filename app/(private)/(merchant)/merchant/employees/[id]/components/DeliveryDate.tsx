'use client'
import { TableCell } from "@/components/shadcn/table"
import { formatDate } from "date-fns"

function DeliveryDate({ date }: { date: string }) {
    const localTime = formatDate(new Date(date), 'PPpp')
    return (
        <TableCell>{localTime}</TableCell>
    )
}

export default DeliveryDate