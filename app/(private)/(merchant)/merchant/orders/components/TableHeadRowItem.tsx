import { TableHead, TableRow } from "@/components/shadcn/table"
import SelectAllCheckbox from "./SelectAllCheckbox"

function TableHeadRowItem({ columns, orderIds }: { columns: string[], orderIds: number[] }) {
    return (
        <TableRow>
            <TableHead className="px-6 py-4 font-semibold text-foreground">
                <SelectAllCheckbox orders={orderIds} />
            </TableHead>

            {
                columns.map((column, index) => (
                    <TableHead key={column} className={`px-6 py-4 ${index === columns.length - 1 ? "text-right" : ""} min-w-[128px]`} >{column}</TableHead>
                ))
            }
        </TableRow>
    )
}

export default TableHeadRowItem