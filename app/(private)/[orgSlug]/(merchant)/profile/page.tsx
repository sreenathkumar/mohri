import { getCurrentUser } from '@/actions/userActions';
import { Card } from '@/components/shadcn/card';
import ProfileInformation from './components/profile-info';
import UserImage from './components/user-image';


async function ProfilePage() {
    const user = await getCurrentUser();
    return (
        <Card className='flex gap-4 p-8 mt-8 mb-4 bg-transparent h-full overflow-y-auto'>
            <div className="flex gap-8 w-full">
                <UserImage avatarUrl={user?.image} email={user?.email} name={user?.name} />
                <ProfileInformation user={user} />
            </div>
        </Card>
    )
}

export default ProfilePage