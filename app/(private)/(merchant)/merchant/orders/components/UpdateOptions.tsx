import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select"
import { DriversType } from "./UpdateOrders"



function StatusUpdateOptions({ options, label, id, placeholder }: { options: string[], label: string, id: string, placeholder: string }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <Select name="status">
                <SelectTrigger id={id}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options?.map((name) => (
                        <SelectItem key={name} value={name.toLowerCase().replace(/\s/g, '_')}>
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function AssigneeUpdateOptions({ options, label, id, placeholder }: { options?: DriversType[], label: string, id: string, placeholder: string, }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <Select name="assignee" >
                <SelectTrigger id={id}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">
                        None
                    </SelectItem>
                    {options?.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export { StatusUpdateOptions, AssigneeUpdateOptions }