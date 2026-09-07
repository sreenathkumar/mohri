'use client'


import { Button } from "@/components/shadcn/button";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { CloudDownload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function SyncBtn() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);

    // handle sync with woo confirmation modal
    const handleModal = () => {
        setModalOpen(!modalOpen);
    }

    const handleClick = async () => {
        toast.loading("Testing: Syncing orders...");
    }
    return (
        <ConfirmationDialog open={modalOpen} onOpenChange={handleModal} trigger={
            <Button variant="outline" size="sm" className='h-11 px-4 gap-2 rounded-xl bg-card border-border text-muted-foreground hover:text-foreground'>
                <CloudDownload className="h-4 w-4" />
            </Button>
        } title="Sync orders with Woocommerce" description="Are you sure? It can remove the current orders and it's data." onConfirm={handleClick} />
    )
}

export default SyncBtn