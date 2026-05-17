'use client'

import {connectShop} from "@/actions/connect/connectShop"
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

  return <form className="space-y-6" action={formAction}>
    <div className="space-y-3">
      <Label>Shop Type</Label>
      <div className="flex gap-4">
        <div className="flex-1">
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
            className={cn(`flex items-center justify-center px-4 h-10 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 peer-checked:text-background peer-checked:font-medium peer-checked:border-border peer-checked:bg-primary hover:border-accent-foreground/20
            ${state?.success === false && "border-red-500 text-red-500 hover:border-red-400 hover:bg-red-500/10"}`)}
          >
            WooCommerce
          </label>
        </div>
        <div className="flex-1">
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
            className={`flex items-center justify-center px-4 h-10 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 peer-checked:text-background peer-checked:font-medium peer-checked:border-border peer-checked:bg-primary hover:border-accent-foreground/20 ${state?.success === false && "border-red-500 text-red-500 hover:border-red-400 hover:bg-red-500/10"}`}
          >
            Shopify
          </label>
        </div>
      </div>
      {state?.errors?.platform && (
        <p className="text-sm text-red-500">{state.errors.platform}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="shop-url">Shop URL</Label>
      <div className="relative">
        <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="shop-url"
          type="url"
          name="url"
          placeholder="https://your-shop.com"
          className={`pl-10 ${state?.success === false && "border-red-500 text-red-500 placeholder:text-red-500 focus:border-red-400 focus:ring-red-400"}`}
          required
        />
      </div>
      {state?.errors?.url && (
        <p className="text-sm text-red-500">{state.errors.url}</p>
      )}
    </div>

    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      Connect
    </Button>
  </form>
}

export default ConnectStoreForm