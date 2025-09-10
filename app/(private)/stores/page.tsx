import { auth } from "@/auth";
import { Store } from "lucide-react";
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
            {
                stores.length > 0
                    ? <ConnectedStores stores={stores} />
                    : <div className="text-center py-12 text-background my-auto">
                        <Store className="h-12 w-12 text-foreground mx-auto mb-4" />
                        <h3 className="text-lg text-muted-foreground font-medium mb-2">No stores connected</h3>
                        <p className="text-muted-foreground mb-4">Connect your first store to get started</p>
                        <AddStoreBtn />
                    </div>
            }
        </div>
    )
}

export default StoresPage