import MakeCurrentBtn from "./MakeCurrentBtn";

interface SecondaryTaskCardProps {
    id: number;
    customer: string;
    amount: string;
}

export default function SecondaryTaskCard({ id, customer, amount }: SecondaryTaskCardProps) {
    return (
        <div className="group bg-card/50 hover:bg-card border border-border/40 hover:border-border/80 rounded-lg p-3.5 flex items-center justify-between transition-all duration-200 active:scale-95">
            <div className="flex-1 min-w-0 flex items-center gap-3">
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">{customer}</p>
                    <p className="text-xs text-foreground/60">{id}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 ml-2 whitespace-nowrap">
                <p className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-sm">{amount}</p>
                <MakeCurrentBtn order_id={id} />
            </div>
        </div>
    );
}
