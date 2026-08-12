import { Button } from "@/components/shadcn/button"
import Link from "next/link"

function ErrorView() {
    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Reset Password</h2>
            <p className='text-sm text-muted-foreground mt-2'>
                Error occurred while resetting the password. Please try again later.
            </p>
            <Button className="w-full mt-6 bg-muted hover:bg-muted/20" asChild>
                <Link href="/reset-password">Try Again</Link>
            </Button>
        </div>
    )
}

export default ErrorView