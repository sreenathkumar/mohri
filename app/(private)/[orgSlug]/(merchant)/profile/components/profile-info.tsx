'use client'
import { updateProfile, UserType } from '@/actions/userActions';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { authClient } from '@/lib/auth-client';
import { updateProfileSchema } from '@/lib/zod';
import React, { useEffect } from 'react';
import DataTable from './data-table';
import { toast } from 'sonner';

function ProfileInformation({ user }: { user?: UserType }) {
    const [initialUser, setInitialUser] = React.useState<UserType | undefined>(user);
    const [mode, setMode] = React.useState<'edit' | 'view'>('view');


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

            if (res.success && res.data) {
                setInitialUser(res.data);
                setMode('view');

                //update name in session
                await authClient.updateUser({ name: res.data.name })
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