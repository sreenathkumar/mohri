'use client'

import { useSearchParams } from 'next/navigation';
import { StoreTypes } from '../page'
import StoreCard from './store-card'
import { useEffect } from 'react';
import { Store } from 'lucide-react';
import AddStoreBtn from './connect-btn';
import { connectShopifyStore } from '@/actions/connect/connectShop';
import toast from 'react-hot-toast';

const APP_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_HOST}`;

function ConnectedStores({ stores }: { stores: StoreTypes[] }) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const state = searchParams.get('state');

  useEffect(()=>{
   
    if(!window) return;
   
    window.opener?.postMessage({
        type: 'CONFIRM_STATE',
        state: state
    }, APP_URL);

    const handleMessage =(event:MessageEvent)=>{
      if (event.origin !== APP_URL) return;

      if (event.data.type === 'STATE_CONFIRMED'){
        connectShopifyStore(token).then((res)=>{
          if(res.success){
             window.opener?.postMessage({type: 'CONNECTION_SUCCEDED'}, APP_URL);
             toast.success(res.message);
          }else{
            toast.error(res.message);
          }
        })
      }
    }

    window.addEventListener('message', handleMessage);
    
    return()=>window.removeEventListener('message', handleMessage);
  }, [])
  
  return (
    <>
    {
      stores.length > 0 ?
    
    <div className="flex flex-col gap-4 mt-10">
      {stores.map((store) => (
        <StoreCard key={store.domain} name={store.name} url={store.domain} platform={store.platform} />
      ))}
    </div> : <div className="text-center py-12 text-background my-auto">
                        <Store className="h-12 w-12 text-foreground mx-auto mb-4" />
                        <h3 className="text-lg text-muted-foreground font-medium mb-2">No stores connected</h3>
                        <p className="text-muted-foreground mb-4">Connect your first store to get started</p>
                        <AddStoreBtn />
                    </div>
    }</>
  )
}

export default ConnectedStores