'use client'

import { Button } from "@/components/shadcn/button"
import { ClipboardCopy } from "@/components/ui/ClipBoardCopy"
import Modal from "@/components/ui/Modal"
import { useClipboardCopy } from "@/context/ClipboardCtx"
import { ClipboardList } from "lucide-react"
import { useState } from "react"

function CopyOrders() {
    const [isOpen, setIsOpen] = useState(false);
    const { clipboardContent, } = useClipboardCopy();

    const openCopyModal = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            {clipboardContent.text &&
                <Button className="absolute top-0 right-0" variant='outline' size='sm' onClick={openCopyModal}>
                    <ClipboardList />
                </Button>}
            <Modal isOpen={isOpen} onClose={openCopyModal} title='Copy orders data to clipboard'>
                <ClipboardCopy content={clipboardContent.text || ''}>
                    {clipboardContent.text}
                </ClipboardCopy>
            </Modal>
        </>
    )
}

export default CopyOrders