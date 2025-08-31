import { CheckCircle } from 'lucide-react'
import { StoreTypes } from '../page'
import { Button } from '@/components/shadcn/button'

function ConnectedStores({ stores }: { stores: StoreTypes[] }) {
  return (
    <div className="flex flex-col gap-4 mt-10">
      {stores.map((store) => (
        <div key={store.url} className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3>Shop Name</h3>
                  <p className="font-medium text-sm text-muted-foreground break-all">{store.url}</p>
                </div>
              </div>
              <div>
                <Button variant='link' size='sm' className='text-muted-foreground text-sm underline hover:text-forground hover:font-bold'>Edit</Button>
                <Button variant='link' size='sm' className='text-muted-foreground text-sm underline hover:text-forground hover:font-bold'>Remove</Button>
              </div>
            </div>

            <div>
              <span className="py-1 px-2 text-xs rounded-full border border-muted-foreground text-muted-foreground capitalize font-medium">
                {store.platform}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConnectedStores