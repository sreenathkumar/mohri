'use client'

import { Button } from "@/components/shadcn/button"
import { useFormStatus } from "react-dom"

function SubmitBtn({ text, loadingText }: { text: string, loadingText: string }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer text-sm" disabled={pending}>
            {pending ? loadingText : text}
        </Button>
    )
}

export default SubmitBtn 