'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function DriverProfilePage() {
    const router = useRouter();
    const logout = async () => {
        try {
            await signOut();
            router.refresh();
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="space-y-6 pb-6">
            {/* Profile Header */}
            <section className="px-4">
                <div className="bg-linear-to-br from-card to-card/80 border border-border/60 rounded-xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-linear-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-3xl font-bold">AS</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Asif Mohammed</h1>
                        <p className="text-xs text-muted-foreground mt-1">Driver ID: DRV-2847</p>
                    </div>
                    <div className="flex items-center justify-center gap-1 bg-secondary/20 border border-secondary/30 px-3 py-1.5 rounded-full inline-block mx-auto">
                        <span className="text-lg">⭐</span>
                        <p className="text-sm font-semibold text-secondary">4.8 Rating</p>
                    </div>
                </div>
            </section>

            {/* Driver Info */}
            <section className="px-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Driver Information</h2>
                <div className="space-y-3">
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Phone Number</p>
                        <p className="text-sm font-semibold text-foreground">+880 1790 234567</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                        <p className="text-sm font-semibold text-foreground break-all">asif.mohammed@email.com</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="text-sm font-semibold text-foreground">Dhaka, Bangladesh</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Joined Since</p>
                        <p className="text-sm font-semibold text-foreground">March 15, 2024</p>
                    </div>
                </div>
            </section>

            {/* Vehicle Info */}
            <section className="px-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Vehicle Information</h2>
                <div className="space-y-3">
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Vehicle Type</p>
                        <p className="text-sm font-semibold text-foreground">Motorcycle</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">License Plate</p>
                        <p className="text-sm font-mono font-semibold text-primary">DHAKA-A 5847</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Insurance Valid Till</p>
                        <p className="text-sm font-semibold text-foreground">December 31, 2026</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Documents Status</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span>
                            <p className="text-sm font-semibold text-secondary">All Verified</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Stats */}
            <section className="px-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Performance</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-primary">856</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Deliveries</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-secondary">98%</p>
                        <p className="text-xs text-muted-foreground mt-1">On-Time Rate</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">324</p>
                        <p className="text-xs text-muted-foreground mt-1">5-Star Ratings</p>
                    </div>
                    <div className="bg-card/50 border border-border/40 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-destructive">2</p>
                        <p className="text-xs text-muted-foreground mt-1">Issues This Month</p>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <section className="px-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Settings</h2>
                <div className="space-y-2">
                    <button className="w-full px-4 py-3 bg-card/50 hover:bg-card border border-border/40 hover:border-border/80 rounded-lg text-sm font-semibold text-foreground transition-all duration-200 active:scale-95">
                        Edit Profile
                    </button>
                    <button className="w-full px-4 py-3 bg-card/50 hover:bg-card border border-border/40 hover:border-border/80 rounded-lg text-sm font-semibold text-foreground transition-all duration-200 active:scale-95">
                        Update Documents
                    </button>
                    <button className="w-full px-4 py-3 bg-card/50 hover:bg-card border border-border/40 hover:border-border/80 rounded-lg text-sm font-semibold text-foreground transition-all duration-200 active:scale-95">
                        Notification Settings
                    </button>
                    <button onClick={logout} className="w-full px-4 py-3 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 hover:border-destructive/50 rounded-lg text-sm font-semibold text-destructive transition-all duration-200 active:scale-95">
                        Logout
                    </button>
                </div>
            </section>
        </div>
    );
}
