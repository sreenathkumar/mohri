import { getShops } from "@/actions/shopActions";
import { Shop } from "@lib/prisma";
import { Store } from "lucide-react";
import AddStoreBtn from "./components/connect-btn";
import StoreCard from "./components/store-card";

export type Store = Pick<Shop, 'name' | 'domain' | 'platform'>;

async function StoresPage() {
    const stores = await getShops();

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
            {stores.length > 0 ?
                <div className="flex flex-col gap-4 mt-10">
                    {stores.map((store) => (
                        <StoreCard key={store.domain} name={store.name} url={store.domain} platform={store.platform} />
                    ))}
                </div> : <div className="flex flex-col items-center text-center py-12 text-background my-auto">
                    <Store className="h-12 w-12 text-foreground mx-auto mb-4" />
                    <h3 className="text-lg text-muted-foreground font-medium mb-2">No stores connected</h3>
                    <p className="text-muted-foreground mb-4">Connect your first store to get started</p>
                    <AddStoreBtn />
                </div>}
        </div>
    )
}

export default StoresPage