import { StoreTypes } from '../page'
import StoreCard from './store-card'

function ConnectedStores({ stores }: { stores: StoreTypes[] }) {
  return (
    <div className="flex flex-col gap-4 mt-10">
      {stores.map((store) => (
        <StoreCard key={store.domain} name={store.name} url={store.domain} platform={store.platform} />
      ))}
    </div>
  )
}

export default ConnectedStores