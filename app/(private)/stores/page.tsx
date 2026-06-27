import { getServerSessionContext } from "@/lib/checkServerAuth";
import AddStoreBtn from "./components/connect-btn";
import ConnectedStores from "./components/connected-stores";
import { getShops } from "@/actions/shop";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export interface StoreTypes {
    domain: string;
    platform: string;
    name?: string;
}

async function StoresPage() {
    const { role } = await getServerSessionContext();

    if (role === 'driver') {
        redirect('/dashboard');
    }

    const stores: StoreTypes[] = await getShops();

    return (
        <div className="p-4 flex flex-col grow-1">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Connected Stores</h1>
                <AddStoreBtn />
            </div>
            <Suspense>
                <ConnectedStores stores={stores} />
            </Suspense>
        </div>
    )
}

export default StoresPage