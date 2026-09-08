'use client'

import { Button } from "@/components/shadcn/button"
import { authClient, useSession } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AcceptInviteBtnProps {
    invitationId: string;
    userEmail?: string;
}

function AcceptInviteBtn({ invitationId }: AcceptInviteBtnProps) {
    const router = useRouter();
    const session = useSession();

    console.log("AcceptInviteBtn session:", session, "invitationId:", invitationId);

    const handleAcceptInvite = async () => {
        const { data, error } = await authClient.organization.acceptInvitation({
            invitationId: invitationId,
        });
        if (error) {
            toast.error(`Error accepting invitation: ${error.message}`);
        } else {
            authClient.organization.setActive({
                organizationId: data.member.organizationId,
                fetchOptions: {
                    onSuccess: () => {
                        console.log("Organization set as active successfully.");
                        router.push('/continue')
                    }
                }
            })
        }
    }
    return (
        <Button
            onClick={handleAcceptInvite}
            className="w-full py-3 px-4 bg-[#F97316] hover:bg-[#E0630D] text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
            Accept Invitation
            <ArrowRight className="w-4 h-4" />
        </Button>
    )
}

export default AcceptInviteBtn