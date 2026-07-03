export default function StatusBanner({ deliveredToday, remaining }: { deliveredToday?: number, remaining?: number }) {

    return (
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-card to-card/50 border border-border/40 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🚗</span>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Runs</p>
                        <p className="text-sm font-semibold text-foreground">{deliveredToday || 0} Deliveries</p>
                    </div>
                </div>
                <div className="w-px h-10 bg-border/30"></div>
                <div className="flex-1 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📦</span>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-sm font-semibold text-primary">{remaining || 0} Tasks</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
