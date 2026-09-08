import { getDriverProfile } from "@/actions/driverActions";
import DriverProfileSetting from "./components/driver-profile-setting";
import DriverProfileDetails from "./components/driver-profile-details";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import LogoutBtn from "./components/logout-btn";
import { getDriverAnalytics } from "@/actions/analyticsActions";

async function DriverProfilePage() {
    const profileData = await getDriverProfile();
    const analytics = await getDriverAnalytics();

    const successRate = Math.round(analytics.DELIVERED / (analytics.ASSIGNED - analytics.FAILED) * 100);

    if (!profileData) {
        return null
    }

    return (
        <main className="space-y-6 p-6">
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-card shadow-2xl shadow-black/10 mt-4">

                <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
                    <div className="flex items-center gap-5">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-orange-600/15 text-2xl font-bold text-orange-400 ring-1 ring-orange-500/30">
                            <Avatar className="w-full h-full rounded-2xl">
                                {profileData?.image && <AvatarImage src={profileData.image} alt={profileData.name} className="" />}
                                <AvatarFallback className="rounded-lg bg-background">{profileData?.name[0]?.toLocaleUpperCase() || "U"}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{profileData?.name || 'Name'}</h2>
                            <p className="mt-1 text-slate-400">{profileData?.role}</p>
                            <span className="text-muted-foreground text-sm"><strong>Active Organization: </strong>{profileData?.organizationName}</span>
                        </div>
                    </div>
                    <LogoutBtn />
                </div>
            </section>
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] ">
                <section className="px-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Performance</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{analytics.DELIVERED}</p>
                            <p className="text-xs text-muted-foreground mt-1">Total Deliveries</p>
                        </div>
                        <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-foregorund">{successRate}%</p>
                            <p className="text-xs text-muted-foreground mt-1">On-Time Rate</p>
                        </div>
                        <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-foreground">0</p>
                            <p className="text-xs text-muted-foreground mt-1">5-Star Ratings</p>
                        </div>
                        <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-destructive">{analytics.FAILED}</p>
                            <p className="text-xs text-muted-foreground mt-1">Total Issues</p>
                        </div>
                    </div>
                </section>
                <DriverProfileDetails employee={profileData} />
            </div>
            <DriverProfileSetting />
        </main>
    );
}

export default DriverProfilePage;