import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

function LoadingEmployee({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center justify-center h-screen w-full", className)}>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    )
}

export default LoadingEmployee