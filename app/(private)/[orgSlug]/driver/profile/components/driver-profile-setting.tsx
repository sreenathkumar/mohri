'use client'


function DriverProfileSetting() {

    return (
        <section className="px-4 mt-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Settings</h2>
            <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-card/50 hover:bg-card border border-border/40 hover:border-border/80 rounded-lg text-sm font-semibold text-foreground transition-all duration-200 active:scale-95">
                    Edit Profile
                </button>
                <button className="w-full px-4 py-3 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 hover:border-destructive/50 rounded-lg text-sm font-semibold text-destructive transition-all duration-200 active:scale-95">
                    Delete the Account
                </button>
            </div>
        </section>
    )
}

export default DriverProfileSetting