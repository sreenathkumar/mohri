import { Badge } from "@/components/shadcn/badge"
import { TableCell, TableRow } from "@/components/shadcn/table"
import { OrderType } from "@/types/OrderType"
import Image from "next/image"
import OrderCheckbox from "./OrderCheckbox"

function OrderRowItem({ order, children }: { order: OrderType, children: React.ReactNode }) {

    return (
        <TableRow>
            <TableCell>
                <OrderCheckbox id={order.order_id} />
            </TableCell>
            <TableCell className="font-medium">{order.order_id}</TableCell>
            <TableCell>{order.name}</TableCell>
            <TableCell>{order.city}</TableCell>
            {/* <TableAddressCell address={order.address} /> */}
            <TableCell>{order.address}</TableCell>
            <TableCell>{order.phone}</TableCell>
            <TableCell>{order.payment === 'hesabe' ? 'PAID' : 'Cash On Delivery'}</TableCell>
            <TableCell>{order.payment === 'hesabe' ? 'N/A' : order.amount}</TableCell>
            <TableCell>
                <Badge
                    variant={order.status === 'completed' ? 'success' : 'warning'}
                    className={
                        order.status === 'completed'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                    }
                >
                    {order.status}
                </Badge>
            </TableCell>
            <TableAssigneeCell assignee={order.asignee} />
            <TableCell className="text-right">
                <div className="flex justify-end gap-4">
                    {children}
                </div>
            </TableCell>
        </TableRow>
    )
}


// function TableAddressCell({
//     address,
// }: {
//     address: {
//         block?: string;
//         street?: string;
//         house?: string;
//         jaddah?: string;
//         floorApt?: string;
//     };
// }) {
//     // Create an array of address parts that will be joined into a single string
//     const addressParts = [
//         address.block && <><strong>Block:</strong> {address.block}</>,
//         address.street && <><strong>Street:</strong> {address.street}</>,
//         address.house && <><strong>House:</strong> {address.house}</>,
//         address.jaddah && <><strong>Jaddah:</strong> {address.jaddah}</>,
//         address.floorApt && <><strong>Floor/Apt:</strong> {address.floorApt}</>,
//     ]
//         .filter(Boolean)

//     return (
//         <TableCell>
//             {/* Conditionally render the address string as a single paragraph */}
//             {addressParts.length > 0 ? <p>{
//                 <>
//                     <>{address.block && <><strong>Block:</strong> {`${address.block}`}</>}</>
//                     <>{address.street && <>, <strong>Street:</strong> {`${address.street}`}</>}</>
//                     <>{address.house && <>, <strong>House:</strong> {`${address.house}`}</>}</>
//                     <>{address.jaddah && <>, <strong>Jaddah:</strong> {`${address.jaddah}`}</>}</>
//                     <>{address.floorApt && <>, <strong>Floor/Apt:</strong> {`${address.floorApt}`}</>}</>
//                 </>}
//             </p>
//                 : <p>No address available</p>}
//         </TableCell>
//     );
// }

//Show the assignee name and image in the table cell
function TableAssigneeCell({ assignee }: { assignee: { id?: string, name?: string, image?: string } | null }) {
    return (
        <TableCell>
            {(assignee?.name && assignee.image) ?
                <div className="flex items-center gap-3 w-full">
                    <Image src={assignee.image} alt={assignee.name || 'assignee_image'} width={32} height={32} className="w-8 h-8 rounded-full" />
                    <span>{assignee.name}</span>
                </div> : assignee?.name}
        </TableCell>
    )
}
export default OrderRowItem