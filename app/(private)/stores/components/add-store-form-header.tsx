import { Store } from "lucide-react"

function AddStoreFormHeader() {
    return (
        <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-popover">
                <Store className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Connect Your Shop</h1>
            <p className="text-muted-foreground mt-2">Connect your WooCommerce or Shopify store to get started</p>
        </div>
    )
}

export default AddStoreFormHeader