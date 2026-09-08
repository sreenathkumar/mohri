import { Badge } from "@/components/shadcn/badge"
import { Button } from "@/components/shadcn/button"
import { X } from "lucide-react"

function OrderBadge({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <Badge className="flex items-center gap-1 pr-1 bg-muted text-foreground">
            {children}
            <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full p-0 hover:bg-background/80"
                onClick={onClose}
            >
                <X className="h-3 w-3" />
                <span className="sr-only">Close</span>
            </Button>
        </Badge>
    )
}

export default OrderBadge