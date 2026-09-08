'use client'

import { Copy } from "lucide-react"
import { useState } from "react"

function CopyButton({ content }: { content?: string }) {
    const [copied, setCopied] = useState(false)

    const copyContent = async () => {
        await navigator.clipboard?.writeText(content || '')
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
    }

    return (
        <>
            <button onClick={copyContent} className="text-primary hover:text-primary/20 cursor-pointer" aria-label="Copy user ID"><Copy className="h-3.5 w-3.5" /></button>
            {copied && <span className="text-xs text-emerald-400">Copied</span>}
        </>

    )
}

export default CopyButton