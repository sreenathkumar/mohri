'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TabControl() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateSearchParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };
    return (
        <div className="mx-4 mt-6 flex gap-2 border-b border-border/30">
            <button
                onClick={() => updateSearchParam('task', 'active')}
                className={`px-3 py-2.5 text-sm font-medium transition-all relative ${searchParams.get('task') === 'active'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                Active Tasks
                <span className="ml-1.5 text-xs bg-primary/80 text-primary-foreground px-1.5 py-0.5 rounded-sm">3</span>
                {(searchParams.get('task') === 'active' || !searchParams.get('task')) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-primary/50 rounded-full"></div>
                )}
            </button>
            <button
                onClick={() => updateSearchParam('task', 'issues')}
                className={`px-3 py-2.5 text-sm font-medium transition-all relative ${searchParams.get('task') === 'issues'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                Issues / Holds
                {searchParams.get('task') === 'issues' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-primary/50 rounded-full"></div>
                )}
            </button>
        </div>
    );
}
