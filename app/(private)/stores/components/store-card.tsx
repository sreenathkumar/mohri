'use client'

import { updateShop } from '@/actions/shopActions';
import { Button } from '@/components/shadcn/button';
import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react';

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
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              {
                mode === 'edit' ?
                  <ShopNameInput setShopName={setShopName} setMode={setMode} url={url} />
                  : <h3>{shopName}</h3>}

              <p className="font-medium text-sm text-muted-foreground break-all">{url}</p>
            </div>
          </div>
          <div>
            <Button onClick={changeMode} variant='link' size='sm' className='text-muted-foreground text-sm underline hover:text-forground hover:font-bold'>{mode === 'edit' ? 'Cancel' : 'Edit'}</Button>
            <Button variant='link' size='sm' className='text-muted-foreground text-sm underline hover:text-forground hover:font-bold'>Remove</Button>
          </div>
        </div>

        <div>
          <span className="py-1 px-2 text-xs rounded-full border border-muted-foreground text-muted-foreground capitalize font-medium">
            {platform}
          </span>
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
        className="text-background border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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