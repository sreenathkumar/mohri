'use client'

import { Button } from "@/components/shadcn/button"
import { useFormStatus } from "react-dom"

function SubmitBtn({ text, loadingText }: { text: string, loadingText: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full bg-card-foreground text-card" disabled={pending}>
            {pending ? loadingText : text}
        </Button>
    )
}

export default SubmitBtn 