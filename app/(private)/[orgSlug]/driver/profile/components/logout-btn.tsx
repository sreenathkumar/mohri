'use client'
import { Button } from '@/components/shadcn/button'
import { LogOut } from 'lucide-react'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function LogoutBtn() {
    const router = useRouter();

    const logout = async () => {
        try {
            await authClient.signOut();
            router.refresh();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Button
            onClick={logout}
            className='bg-destructive text-foreground text-base rounded-full hover:bg-destructive/40' >
            Logout
            <LogOut className='ml-1 h-4 w-4' />
        </Button>
    )
}

export default LogoutBtn