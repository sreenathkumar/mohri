import { CardContent } from "@/components/shadcn/card";
import Image from "next/image";

interface UserInfoType {
    name: string,
    image: string,
    address: string
}

async function UserInfo({ user }: { user: UserInfoType | null }) {


    if (!user) return (
        <div className="flex items-center space-x-4 text-gray-400">
            Your information is not available.
        </div>
    );

    return (
        <CardContent className="flex items-start space-x-6">
            {
                user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name}
                        width={96}
                        height={96}
                        className="rounded-full"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-muted flex justify-center items-center text-4xl font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                )
            }
            <div>
                <h2 className="text-2xl font-bold">{user.name || 'John Doe'}</h2>
                <p className="text-gray-500">{user.address || 'No address'}</p>
            </div>
        </CardContent>

    )
}

export default UserInfo