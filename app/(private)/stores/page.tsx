import getShops from "@/actions/connect/getStores";
import AddStoreFormHeader from "./components/add-store-form-header";
import ConnectStoreForm from "./components/connect-store-form";
import ConnectedStores from "./components/connected-stores";
import { auth } from "@/auth";

async function StoresPage() {
    const session = await auth();
    if (!session) {
        return <p>Getting user info failed.</p>
    }

    const userId = session.user?.id;

    const connectedStores = await getShops(userId);

    return (
        <div className="flex items-center justify-center my-auto p-4">
            {
                connectedStores.length > 0
                    ? <ConnectedStores />
                    : <div className="w-full max-w-md space-y-8 p-6 rounded-lg border">
                        <AddStoreFormHeader />
                        <ConnectStoreForm />
                    </div>
            }
        </div>
    )
}

export default StoresPage