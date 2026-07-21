'use client'

import { deleteShop, updateShop } from '@/actions/shop';
import { Button } from '@/components/shadcn/button';
import { CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import RemoveStoreBtn from './remove-store';

function StoreCard({ name, url, platform }: { name?: string, url: string, platform: string }) {
  const [shopName, setShopName] = useState(name || 'Shop Name');
  const [mode, setMode] = useState('');

  const changeMode = () => {
    if (mode === 'edit') {
      setMode('');
    } else {
      setMode('edit');
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-md">
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-2xl transition-colors duration-300 pointer-events-none z-10"></div>
      <div className="relative bg-card border border-border rounded-2xl p-6 sm:p-8 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:flex-row-reverse gap-6">
          <div className="shrink-0 self-start sm:self-auto">
            <span className="py-1.5 px-4 ml-auto text-xs rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100/50 dark:bg-white/[0.04] text-muted-foreground font-bold shadow-sm select-none tracking-wide">
              {platform}
            </span>
          </div>
          <div className="flex items-start gap-5 flex-1">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="flex-1">
              <div>
                {
                  mode === 'edit' ?
                    <ShopNameInput setShopName={setShopName} setMode={setMode} url={url} />
                    : <h3 className='font-bold text-md text-foreground leading-snug md:text-lg'>{shopName}</h3>}

                <p className="font-medium text-xs text-muted-foreground break-all mt-0.5 md:text-sm">{url}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={changeMode} variant='link' size='sm' className='text-foreground/80 hover:text-primary font-bold text-xs underline decoration-dotted underline-offset-4 transition-colors cursor-pointer px-0'>{mode === 'edit' ? 'Cancel' : 'Edit'}</Button>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/[0.15]" />
                <RemoveStoreBtn onConfirm={() => deleteShop(url)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShopNameInput({ setShopName, setMode, url }: { setShopName: React.Dispatch<React.SetStateAction<string>>, setMode: React.Dispatch<React.SetStateAction<string>>, url: string }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // handle save action
  const handleUpdate = async () => {
    // Call server action to update shop name in the database
    const response = await updateShop(url, { name: inputValue });
    if (response.success) {
      setShopName(inputValue);
      setMode('');
    } else {
      setError(response.message || 'Failed to update shop name');
    }
  }
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter shop name"
        className="text-foreground border border-border rounded-xl px-2 py-1 focus:outline-hidden focus:ring-2 focus:ring-ring"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        variant='outline'
        size='sm'
        onClick={handleUpdate}
        className='text-muted-foreground text-sm hover:text-foreground hover:font-bold'
      >
        Save
      </Button>
    </div>
  );
}

export default StoreCard