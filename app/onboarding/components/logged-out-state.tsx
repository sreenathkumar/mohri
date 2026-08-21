import { getInvitationDetails } from "@/actions/employeeActions";
import { ArrowRight, Building2, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";

interface LoggedOutStateProps {
    invitationId?: string;
}

async function LoggedOutState({ invitationId }: LoggedOutStateProps) {
    if (!invitationId) {
        redirect('/login')
    }

    const invite = await getInvitationDetails({ invitationId });

    //if the invitation is not found, show an error message
    if (!invite) {
        return (
            <div className="w-full max-w-md bg-[#1E293B]/70 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 text-center border-b border-slate-800/60">
                    <div className="mx-auto w-12 h-12 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">
                        Organization Invite
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Wrong or expired invitation link. Please check the link and try again.
                    </p>
                </div>
            </div>
        )
    }

    const redirectUrl = `/login?callbackUrl=${encodeURIComponent(`/onboarding?invitationId=${invitationId}`)}`;

    return (
        <div className="w-full max-w-md bg-[#1E293B]/70 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

            {/* Header Area */}
            <div className="p-6 text-center border-b border-slate-800/60">
                <div className="mx-auto w-12 h-12 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-[#F97316]" />
                </div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Organization Invite
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    You have been invited to join an organization on our platform.
                </p>
            </div>

            <div className="p-6 space-y-5">
                {/* Organization Invitation Details Card */}
                <div className="bg-[#0F172A]/60 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-semibold text-white text-base">
                                {invite?.organization.name}
                            </h2>
                            <p className="text-xs text-slate-400">
                                Invited by <span className="text-slate-300">{invite?.user.name}</span>
                            </p>
                        </div>
                        <span className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700">
                            {invite.role}
                        </span>
                    </div>

                    <div className="border-t border-slate-800 pt-3 flex items-center text-xs text-slate-400 gap-2">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Target Email:</span>
                        <span className="text-slate-200 font-mono truncate">
                            {invite?.email}
                        </span>
                    </div>
                </div>

                <Link href={redirectUrl}
                    className="w-full py-3 px-4 bg-[#F97316] hover:bg-[#E0630D] text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    Accept Invitation
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}

export default LoggedOutState