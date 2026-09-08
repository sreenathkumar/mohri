import { EmployeeType } from "@/actions/employeeActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Mail, MapPin, Phone } from "lucide-react";
import CopyButton from "./copy-button";

function ProfileHighlight({ user }: { user: EmployeeType }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-card shadow-2xl shadow-black/10">
            <div className="h-2 bg-gradient-to-r from-primary via-orange-400 to-primary" />
            <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
                <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-orange-600/15 text-2xl font-bold text-orange-400 ring-1 ring-orange-500/30">
                        <Avatar className="w-full h-full rounded-2xl">
                            {user?.image && <AvatarImage src={user.image} alt={user.name} className="" />}
                            <AvatarFallback className="rounded-lg bg-background">{user?.name[0]?.toLocaleUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">{user?.name || 'Name'}</h2>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{"Active"}</span>
                        </div>
                        <p className="mt-1 text-slate-400">{user?.role}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-cyan-400" />{user?.address}</span>
                            <span className="text-slate-700">•</span>
                            <span>user ID: {user?.id}</span>
                            <CopyButton content={user?.id} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <a href={`mailto:${user?.email}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-white"><Mail className="h-4 w-4 text-cyan-400" />Email user</a>
                    {user?.phone && <a href={`tel:${user.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"><Phone className="h-4 w-4" />Contact</a>}
                </div>
            </div>
        </section>
    )
}

export default ProfileHighlight