'use client'

import { inviteEmployeeInBulk } from "@/actions/employeeActions";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Mail, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface InviteMember {
    email: string;
    role: "owner" | "manager" | "driver";
}

function InviteOrgMember() {
    const router = useRouter();

    const [invites, setInvites] = useState<InviteMember[]>([
        { email: "", role: "manager" },
    ]);

    // dynamic invite list
    const handleAddInviteRow = () => {
        if (invites.length >= 5) {
            toast.error("You can invite a maximum of 5 members at a time.");
            return;
        }
        setInvites((prev) => [
            ...prev,
            { email: "", role: "manager" },
        ]);
    };

    const handleRemoveInviteRow = (index: number) => {
        if (invites.length === 1) return;
        setInvites((prev) => prev.filter((_, i) => i !== index));
    };

    const handleInviteChange = (
        email: string,
        field: "email" | "role",
        value: string
    ) => {
        setInvites((prev) =>
            prev.map((item) => (item.email === email ? { ...item, [field]: value } : item))
        );
    };

    //send invites
    const handleSendInvites = async (skip: boolean = false) => {
        if (!skip) {
            const seen = new Set();
            const validInvites = invites.filter((i) => {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.email);
                const isUnique = !seen.has(i.email);

                if (!isUnique) {
                    toast.error(`Duplicate email: ${i.email}`);
                    return
                }

                seen.add(i.email);
                return isValidEmail && isUnique;
            });

            const toastId = toast.loading("Sending invites and finishing up. Hold tight...");
            const res = await inviteEmployeeInBulk({ invites: validInvites });

            if (!res.success) {
                toast.error(res.message, { id: toastId });
                return;
            }

            toast.success("Invites sent successfully!", { id: toastId });
        }

        // Redirect to dashboard on completion
        router.push('/continue')
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-[#F97316]" />
                </div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Invite members
                </h1>
                <p className="text-sm text-slate-400">
                    Add team members to your organization. You can invite them now or skip and do it later.
                </p>
            </div>

            {/* Dynamic Invites Form */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {invites.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                            <Input
                                type="email"
                                placeholder="colleague@company.com"
                                value={item.email}
                                onChange={(e) =>
                                    handleInviteChange(item.email, "email", e.target.value)
                                }
                                className="w-full pl-9 pr-3 py-2 bg-[#0F172A]/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#F97316] text-xs transition-colors"
                            />
                        </div>
                        <Select value={item.role} onValueChange={(value) => handleInviteChange(item.email, "role", value)}>
                            <SelectTrigger className="border-border rounded-xl">
                                <SelectValue placeholder='Select a role' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="driver">Driver</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Remove Button */}
                        {invites.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveInviteRow(index)}
                                className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add More Row Button */}
            <button
                type="button"
                onClick={handleAddInviteRow}
                className="text-xs text-[#F97316] hover:underline font-medium inline-block"
            >
                + Add another member
            </button>

            {/* Actions */}
            <div className="pt-2 space-y-3">
                <button
                    type="button"
                    onClick={() => handleSendInvites(false)}
                    className="w-full py-3 px-4 bg-[#F97316] hover:bg-[#E0630D] text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    <ShieldCheck className="w-4 h-4" />
                    Send Invites & Finish
                </button>

                <button
                    type="button"
                    onClick={() => handleSendInvites(true)}
                    className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs text-center transition-colors"
                >
                    Skip for now, go to dashboard
                </button>
            </div>
        </div>
    )
}

export default InviteOrgMember