'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { StoreTypes } from '../page'
import StoreCard from './store-card'
import { useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import AddStoreBtn from './connect-btn';
import { confirmShopConnection } from '@/actions/connect/connectShop';
import toast from 'react-hot-toast';


function ConnectedStores({ stores }: { stores: StoreTypes[] }) {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const challenge = searchParams.get('code_challenge');
  const state = searchParams.get('state');
  const shop = searchParams.get('shop');
  const [isConnecting, setIsConnecting] = useState(!!shop && !!state && !!challenge)

  useEffect(() => {
    let isMounted = true;

    async function verifyParams() {
      if (!shop || !state || !challenge) return;

      const { success, message } = await confirmShopConnection({ shop, state, challenge });

      if (!isMounted) return;

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
      setIsConnecting(false);
      router.replace(pathname)
    }

    verifyParams();

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      {isConnecting ? <p>Loading screen</p> :
        (stores.length > 0 ?
          <div className="flex flex-col gap-4 mt-10">
            {stores.map((store) => (
              <StoreCard key={store.domain} name={store.name} url={store.domain} platform={store.platform} />
            ))}
          </div> : <div className="text-center py-12 text-background my-auto">
            <Store className="h-12 w-12 text-foreground mx-auto mb-4" />
            <h3 className="text-lg text-muted-foreground font-medium mb-2">No stores connected</h3>
            <p className="text-muted-foreground mb-4">Connect your first store to get started</p>
            <AddStoreBtn />
          </div>)
      }
      </>
  )
}

export default ConnectedStores