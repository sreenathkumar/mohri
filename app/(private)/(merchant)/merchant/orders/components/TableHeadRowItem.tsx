import { TableHead, TableRow } from "@/components/shadcn/table"
import SelectAllCheckbox from "./SelectAllCheckbox"

function TableHeadRowItem({ columns, orderIds }: { columns: string[], orderIds: number[] }) {
    return (
        <TableRow>
            <TableHead className="w-12">
                <SelectAllCheckbox orders={orderIds} />
            </TableHead>

            {
                columns.map((column, index) => (
                    <TableHead key={column} className={`${index === columns.length - 1 ? "text-right" : ""} min-w-[128px]`} >{column}</TableHead>
                ))
            }
        </TableRow>
    )
}

export default TableHeadRowItem