import { getInvitationDetails } from "@/actions/employeeActions";
import { Session } from "@/lib/auth-client";
import { Building2, Mail, ShieldAlert } from "lucide-react";
import AcceptInviteBtn from "./accept-invite-btn";
import OnboardingFlow from "./onboarding-flow";
import OrgExists from "./org-active-view";
import SwitchOrgBtn from "./switch-org-btn";


interface LoggedInStateProps {
    invitationId?: string;
    session: Session
}
async function LoggedInState({ invitationId, session }: LoggedInStateProps) {
    //check if the user already has an active organization, 
    if (session?.session?.activeOrganizationId) {
        const activeRole = session?.session?.role;
        let dashboardUrl = `/${session?.session?.activeOrganizationSlug}/dashboard`;

        if (activeRole === 'driver') {
            dashboardUrl = `/${session?.session?.activeOrganizationSlug}/driver/dashboard`;
        }

        return (<OrgExists dashUrl={dashboardUrl} />);
    }

    //fetch the invitation for the user
    const invite = await getInvitationDetails({ invitationId, email: session?.user?.email });

    //if no invitation is found, show the regular onboarding flow
    if (!invite) {
        return <OnboardingFlow />
    }

    //invite exists
    //check if the logged in user email matches the invite email
    const userEmail = session?.user?.email;
    const isEmailMismatch = userEmail !== invite.email;

    return (
        <div className="w-full max-w-md backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

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

                {/* Email Mismatch Warning Box */}
                {isEmailMismatch && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                            <h3 className="font-medium text-amber-500">Account Mismatch</h3>
                            <p className="text-slate-300 leading-relaxed">
                                You are signed in as{" "}
                                <strong className="text-amber-400 font-normal">{userEmail}</strong>.
                                Switch to <strong className="text-amber-400 font-normal">{invite?.email}</strong> to accept this invite.
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Action Button*/}
                <div className="pt-2">
                    {isEmailMismatch ? (
                        <SwitchOrgBtn invitationId={invitationId} />
                    ) : <AcceptInviteBtn invitationId={invite.id} userEmail={userEmail} />}
                </div>
            </div>
        </div>
    )
}

export default LoggedInState