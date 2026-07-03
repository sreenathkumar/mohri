import { getUser } from '@/actions/user';
import { auth } from '@/auth';
import { Card } from '@/components/shadcn/card';
import { redirect } from 'next/navigation';
import ProfileInformation from './components/profile-info';
import UserImage from './components/user-image';
import { UserProfileType } from '@/types/UserType';

async function ProfilePage() {
    const session = await auth();
    if (!session) redirect('/login');

    const { email, name, id } = session?.user;

    const user = await getUser({ userId: id }) as UserProfileType;

    return (
        <Card className='flex gap-4 p-8 mt-8 mb-4 bg-transparent h-full overflow-y-auto'>
            <div className="flex gap-8 w-full">
                <UserImage avatarUrl={user?.image} email={email} name={name} />
                <ProfileInformation user={user} />
            </div>
        </Card>
    )
}

export default ProfilePage