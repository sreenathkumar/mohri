'use client'

import { createContext, useContext, useState } from "react";

// Define the type for the context value
interface SelectedOrderContextType {
    selectedOrder: string[];
    setSelectedOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

// context which will provide the selected order for actions (i.e, update, delete)
const SelectedOrderCtx = createContext<SelectedOrderContextType | undefined>(undefined);

//const provider for SelectedOrderCtx 
const SelectedOrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedOrder, setSelectedOrder] = useState<string[] | []>([]);

    return (
        <SelectedOrderCtx.Provider value={{ selectedOrder, setSelectedOrder }}>
            {children}
        </SelectedOrderCtx.Provider>
    )
}

//hook to use the SelectedOrderCtx
const useSelectedOrder = () => {
    const context = useContext(SelectedOrderCtx);
    if (!context) {
        throw new Error('useSelectedOrderCtx must be used within a SelectedOrderProvider');
    }
    return context;
}

export { SelectedOrderProvider, useSelectedOrder };
