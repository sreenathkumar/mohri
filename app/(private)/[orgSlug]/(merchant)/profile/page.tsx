import { getCurrentUser } from '@/actions/userActions';
import { Card } from '@/components/shadcn/card';
import { UserProfileType } from '@/types/UserType';
import ProfileInformation from './components/profile-info';
import UserImage from './components/user-image';


async function ProfilePage() {
    const user = await getCurrentUser();
    return (
        <Card className='flex gap-4 p-8 mt-8 mb-4 bg-transparent h-full overflow-y-auto'>
            <div className="flex gap-8 w-full">
                <UserImage avatarUrl={user?.image} email={user?.email} name={user?.name} />
                <ProfileInformation user={
                    ({
                        id: user?.id,
                        name: user?.name ?? undefined,
                        address: user?.address ?? undefined,
                        phone: user?.phone ?? undefined,
                        image: user?.image ?? undefined,
                        email: user?.email,
                    } as UserProfileType)

                } />
            </div>
        </Card>
    )
}

export default ProfilePage