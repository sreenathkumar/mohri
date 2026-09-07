import { Badge } from "@/components/shadcn/badge"
import { TableCell, TableRow } from "@/components/shadcn/table"
import Image from "next/image"
import OrderCheckbox from "./OrderCheckbox"
import { AssigneeType, OrderType } from "@/types/OrderType"
import { OrderStatus } from "@lib/prisma"

function OrderRowItem({ order, children }: { order: OrderType, children: React.ReactNode }) {

    return (
        <TableRow className="border-b border-border/60 hover:bg-muted/10 transition-colors group">
            <TableCell className="px-6 py-4 text-muted-foreground">
                <OrderCheckbox id={order.order_id} />
            </TableCell>
            <TableCell className="font-medium px-6 py-4 text-muted-foreground">{order.order_id}</TableCell>
            <TableCell className="px-6 py-4 text-muted-foreground">{order.name}</TableCell>
            <TableCell className="px-6 py-4 text-muted-foreground">{order.city}</TableCell>
            <TableCell className="px-6 py-4 text-muted-foreground">{order.address}</TableCell>
            <TableCell className="px-6 py-4 text-muted-foreground">{order.phone}</TableCell>
            <TableCell className="px-6 py-4 text-muted-foreground">{order.payment === 'hesabe' ? 'PAID' : 'Cash On Delivery'}</TableCell>
            <TableCell className="px-6 py-4 text-foreground">{order.payment === 'hesabe' ? 'N/A' : order.amount}</TableCell>
            <TableCell>
                <Badge
                    variant={order.status === OrderStatus.DELIVERED ? 'default' : 'secondary'}
                >
                    {order.status}
                </Badge>
            </TableCell>
            <TableAssigneeCell assignee={order.assignee} />
            <TableCell className="text-right px-6 py-4 text-muted-foreground">
                <div className="flex justify-end gap-4">
                    {children}
                </div>
            </TableCell>
        </TableRow>
    )
}

//Show the assignee name and image in the table cell
function TableAssigneeCell({ assignee }: { assignee: AssigneeType | null }) {
    return (
        <TableCell className="px-6 py-4 text-muted-foreground">
            {(assignee?.name && assignee.image) ?
                <div className="flex items-center gap-3 w-full">
                    <Image src={assignee.image} alt={assignee.name || 'assignee_image'} width={32} height={32} className="w-8 h-8 rounded-full" />
                    <span>{assignee.name}</span>
                </div> : assignee?.name}
        </TableCell>
    )
}
export default OrderRowItem