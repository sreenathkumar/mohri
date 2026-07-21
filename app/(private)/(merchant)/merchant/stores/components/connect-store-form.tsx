'use client'

import { connectShop } from "@/actions/integration/connectShop"
import { Input } from "@/components/shadcn/input"
import { Label } from "@/components/shadcn/label"
import { cn } from "@/lib/utils"
import { Button } from "@components/shadcn/button"
import { Link } from "lucide-react"
import { useActionState } from "react"
interface ErrorType {
  url?: string;
  platform?: string;
}

const initialState: { success?: boolean, message: string, errors?: ErrorType } = { message: '', errors: {} }

function ConnectStoreForm() {
  const [state, formAction, pending] = useActionState(connectShop, initialState)

  return <form className="flex flex-col gap-6 relative z-10" action={formAction}>
    <div>
      <Label className="text-xs font-bold tracking-wider text-muted-foreground mb-3">Shop Type</Label>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex">
          <input
            type="radio"
            id="woocommerce"
            name="platform"
            value="woocommerce"
            className="sr-only peer"
            required
          />
          <label
            htmlFor="woocommerce"
            className={cn(`flex-1 text-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 border capitalize text-sm cursor-pointer border-border text-muted-foreground hover:border-primary  hover:text-primary-foreground peer-checked:text-primary-foreground peer-checked:border-primary peer-checked:shadow-lg peer-checked:shadow-primary/15 peer-checked:bg-primary
            ${state?.success === false && "border-red-500 text-red-500 hover:border-red-400 hover:bg-red-500/10"}`)}
          >
            WooCommerce
          </label>
        </div>
        <div className="flex">
          <input
            type="radio"
            id="shopify"
            name="platform"
            value="shopify"
            className="sr-only peer"
            required
          />
          <label
            htmlFor="shopify"
            className={`flex-1 text-center px-4 py-3 rounded-xl font-semibold transition-all duration-200 border capitalize text-sm cursor-pointer border-border text-muted-foreground hover:border-primary  hover:text-primary-foreground peer-checked:text-primary-foreground peer-checked:border-primary peer-checked:shadow-lg peer-checked:shadow-primary/15 peer-checked:bg-primary ${state?.success === false && "border-red-500 text-red-500 hover:border-red-400 hover:bg-red-500/10"}`}
          >
            Shopify
          </label>
        </div>
      </div>
      {state?.errors?.platform && (
        <p className="text-sm text-red-500">{state.errors.platform}</p>
      )}
    </div>

    <div>
      <Label className="text-xs font-bold tracking-wider text-muted-foreground mb-3" htmlFor="shop-url">Shop URL</Label>
      <div className="relative">
        <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="shop-url"
          type="url"
          name="url"
          placeholder="https://your-shop.com"
          className={`w-full pl-11 pr-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm ${state?.success === false && "border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-ring"}`}
          required
        />
      </div>
      {state?.errors?.url && (
        <p className="text-sm text-red-500">{state.errors.url}</p>
      )}
    </div>

    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 cursor-pointer text-sm relative z-10" size="lg" disabled={pending}>
      Connect
    </Button>
    <p className="text-[10px] text-muted-foreground text-center mt-6 uppercase tracking-widest font-semibold relative z-10">
      Encrypted & Secure Connection
    </p>
  </form>
}

export default ConnectStoreForm