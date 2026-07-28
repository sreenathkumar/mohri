'use client'
import React, { useEffect } from 'react'
import DataTable from './data-table'
import { UserProfileType } from '@/types/UserType'
import { Button } from '@/components/shadcn/button';
import { updateProfileSchema } from '@/lib/zod';
import toast from 'react-hot-toast';
import { Input } from '@/components/shadcn/input';
import { updateProfile } from '@/actions/user';
import { useSession } from 'next-auth/react';

function ProfileInformation({ user }: { user?: UserProfileType }) {
    const [initialUser, setInitialUser] = React.useState<UserProfileType | undefined>(user);
    const [mode, setMode] = React.useState<'edit' | 'view'>('view');
    const { data: session, update } = useSession();


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const toastId = toast.loading('Updating profile...');

        const formData = new FormData(e.currentTarget);
        const { name, address, phone } = Object.fromEntries(formData);

        const validatedFields = updateProfileSchema.safeParse({ name, address, phone });

        if (!validatedFields.success) {
            toast(validatedFields.error.message);
            return;
        }
        const validatedData = validatedFields.data;
        const iniData = { name: initialUser?.name, address: initialUser?.address, phone: initialUser?.phone };

        /** comparing the initial data with the validated data
         * if they are not equal, then update the profile
         * if they are equal, then do nothing
         */
        if (JSON.stringify(iniData) !== JSON.stringify(validatedData)) {

            //update profile
            const res = await updateProfile({ email: user?.email || '', ...validatedData });

            if (res?.status === 'success') {
                setInitialUser(res.data);
                setMode('view');

                //update name in session
                update({ ...session, user: { ...session?.user, name: validatedData.name } });
                toast.success(res.message, { id: toastId });
            } else {
                toast.error(res?.message, { id: toastId });
            }

        } else {
            toast.error('No changes made', { id: toastId });
        }

    }

    const handleMode = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMode(mode === 'view' ? 'edit' : 'view')
    }

    useEffect(() => {
        setInitialUser(user)
    }, [user])

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 items-start gap-10">
                <div className="flex justify-between w-full">
                    <div className="flex flex-col items-start gap-2">
                        {mode === 'edit' ? <Input type="text" name='name' defaultValue={initialUser?.name} /> : <h1 className='text-4xl font-bold'>{initialUser?.name || 'User Name'}</h1>}
                        <p className='text-muted-foreground text-base'>{initialUser?.email}</p>
                    </div>
                    <Button type='button' className='ml-auto' onClick={handleMode}>{mode === 'view' ? 'Edit' : 'Cancel'}</Button>
                </div>

                <DataTable mode={mode} address={initialUser?.address || ''} phone={initialUser?.phone || ''} />
            </form>

        </>
    )
}

export default ProfileInformation