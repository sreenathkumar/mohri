"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/shadcn/button"
import { Card, CardContent } from "@/components/shadcn/card"

interface ClipboardCopyProps {
    content: string,
    children: React.ReactNode,
    className?: string
}

export function ClipboardCopy({ content, children, className }: ClipboardCopyProps) {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Failed to copy text: ", err.message)
        }
    }

    return (
        <Card className={className}>
            <CardContent className="pt-6 p-0">
                <div className="relative bg-background p-4 rounded-md cursor-pointer group max-h-[80vh] overflow-y-auto" onClick={copyToClipboard}>
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap wrap-break-word">{children}</pre>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={copyToClipboard}
                    >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                {isCopied && <p className="text-sm text-muted-foreground mt-2 text-center">Copied to clipboard!</p>}
            </CardContent>
        </Card>
    )
}

