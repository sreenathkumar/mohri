'use client'

import { Button } from "@/components/shadcn/button"
import { signOut } from "@/lib/auth-client"
import { UserCheck } from "lucide-react"
import { useRouter } from "next/navigation";

interface SwitchOrgBtnProps {
    invitationId?: string;
}
function SwitchOrgBtn({ invitationId }: SwitchOrgBtnProps) {
    const router = useRouter();

    const handleOrgSwitch = () => {
        console.log("Switching organization, logging out the user...");
        console.log(`Invitation ID: ${invitationId}`);
        signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push(`/login?callbackUrl=/onboarding?invitationId=${invitationId}`);
                }
            }
        });
    }
    return (
        <Button
            onClick={handleOrgSwitch}
            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl border border-slate-700 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
            <UserCheck className="w-4 h-4 text-slate-400" />
            Logout to Switch Account
        </Button>
    )
}

export default SwitchOrgBtn