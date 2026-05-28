import { auth } from "@/auth";
import AddStoreBtn from "./components/connect-btn";
import ConnectedStores from "./components/connected-stores";
import { getShops } from "@/actions/shopActions";

export interface StoreTypes {
    domain: string;
    platform: string;
    name?: string;
}

async function StoresPage() {
    const session = await auth();
    if (!session) {
        return <p>Getting user info failed.</p>
    }

    const userId = session.user?.id;
    const stores: StoreTypes[] = await getShops(userId);

    return (
        <div className="p-4 flex flex-col grow-1">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Connected Stores</h1>
                <AddStoreBtn />
            </div>
             <ConnectedStores stores={stores} />
        </div>
    )
}

export default StoresPage