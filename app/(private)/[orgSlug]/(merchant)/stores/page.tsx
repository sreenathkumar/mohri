import { getShops } from "@/actions/shopActions";
import { Suspense } from "react";
import AddStoreBtn from "./components/connect-btn";
import ConnectedStores from "./components/connected-stores";

export const dynamic = 'force-dynamic';

export interface StoreTypes {
    domain: string;
    platform: string;
    name?: string;
}

async function StoresPage() {
    const stores: StoreTypes[] = await getShops();

    return (
        <div className="p-4 flex flex-col grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/[0.06]">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Connected Stores</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your connected e-commerce sales channels and parameters.
                    </p>
                </div>

                <AddStoreBtn />
            </div>
            <Suspense>
                <ConnectedStores stores={stores} />
            </Suspense>
        </div>
    )
}

export default StoresPage