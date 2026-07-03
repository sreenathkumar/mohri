'use client'
import { updateProfilePhoto } from "@/actions/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

function UserImage({ avatarUrl, email, name }: { avatarUrl?: string, email?: string, name?: string }) {
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();
    const { data: session, update } = useSession();


    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();
        const toastId = toast.loading('Updating profile photo...');

        const formData = new FormData();

        formData.append('avatar', selectedFile as File);
        formData.append('email', email as string);

        //send data to the server
        const res = await updateProfilePhoto(formData);

        if (res?.status === 'success') {
            update({ ...session, user: { ...session?.user, image: res.url } });
            setPreview(undefined);
            toast.success(res.message, { id: toastId });
            router.refresh();
        } else {
            toast.error(res?.message || 'Something went wrong', { id: toastId });
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
                {preview ? (
                    <AvatarImage src={preview} alt="User avatar" />
                ) : avatarUrl && (
                    <AvatarImage src={avatarUrl} alt="User avatar" />
                )}
                <AvatarFallback>{name?.[0].toLocaleUpperCase() || 'U'}</AvatarFallback>
            </Avatar>

            {!preview && <Button type="button" variant="outline" className="cursor-pointer text-xs px-3 py-2 h-auto">
                <label className="cursor-pointer">
                    Change Avatar
                    <input
                        type="file"
                        className="hidden"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </label>
            </Button>}
            {
                preview && <div className="w-full flex justify-between">
                    <Button type="button" className="p-2 h-auto bg-red-400" onClick={() => setPreview(undefined)}><X className="h-4 w-4" /></Button>
                    <Button onClick={handleSubmit} className="p-2 h-auto"><Check className="h-4 w-4" /></Button>
                </div>
            }

        </div>
    )
}

export default UserImage