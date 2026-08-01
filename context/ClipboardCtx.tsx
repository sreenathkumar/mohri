'use client'

import { OrderStatus } from '@lib/prisma';
import { createContext, useContext, useState } from "react";

// Define the type for the context value
interface ClipboardCtxType {
    clipboardContent: ClipBoardContentType;
    setClipboardContent: React.Dispatch<React.SetStateAction<ClipBoardContentType>>;
    clearClipboard: () => void;
}

interface ClipBoardContentType {
    text?: string,
    status?: Extract<OrderStatus, 'PROCESSING' | 'DELIVERED'>,
    ids: number[]
}

// context which will provide the selected order for actions (i.e, update, delete)
const ClipboardCtx = createContext<ClipboardCtxType | undefined>(undefined);

//const provider for SelectedOrderCtx 
const ClipboardProvider = ({ children }: { children: React.ReactNode }) => {
    const [clipboardContent, setClipboardContent] = useState<ClipBoardContentType>({
        text: '',
        ids: [],
    });

    const clearClipboard = () => {
        setClipboardContent({
            text: '',
            ids: [],
            status: undefined,
        });
    };

    return (
        <ClipboardCtx.Provider value={{ clipboardContent, setClipboardContent, clearClipboard }}>
            {children}
        </ClipboardCtx.Provider>
    )
}

//hook to use the SelectedOrderCtx
const useClipboardCopy = () => {
    const context = useContext(ClipboardCtx);
    if (!context) {
        throw new Error('useClipboardCopy must be used within a ClipboardProvider');
    }
    return context;
}

export { ClipboardProvider, useClipboardCopy };
