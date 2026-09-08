'use client'

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close the modal when the escape key is pressed
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    // Focus the modal when it opens
    useEffect(() => {
        if (isOpen) {
            modalRef.current?.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    const modalRoot = document.getElementById("modal-root") ?? document.body

    return createPortal(
        <div className="fixed inset-0  px-2 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-hidden focus:outline-hidden">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div
                ref={modalRef}
                className="relative w-full max-w-md p-6 mx-auto my-8 bg-muted rounded-lg shadow-lg"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex items-start justify-between pb-3">
                    <h3 id="modal-title" className="text-xl font-semibold">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>, modalRoot)
}

export default Modal