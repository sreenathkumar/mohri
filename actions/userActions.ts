'use server';

import {
    findUserById,
    updateUserProfile,
    uploadAndUpdateUserPhoto,
    UpdateProfileParams,
} from '@/services/userService';
import { UserProfileType } from '@/types/UserType';

//get user by id
export async function getUser({ userId }: { userId: string }) {
    if (!userId) return null;

    try {
        const user = await findUserById(userId);

        if (!user) return null;

        return {
            name: user.name,
            email: user.email,
            image: user.image,
            address: user.address,
            phone: user.phone,
        };
    } catch (error: any) {
        console.error('Error fetching user:', error?.message);
        return null;
    }
}

//update user profile information
export async function updateProfile(params: UpdateProfileParams) {
    try {
        const updatedUser = await updateUserProfile(params);

        const updatedData: UserProfileType = {
            id: updatedUser.id,
            name: updatedUser.name ?? undefined,
            address: updatedUser.address ?? undefined,
            phone: updatedUser.phone ?? undefined,
            image: updatedUser.image ?? undefined,
            email: updatedUser.email,
        };

        return {
            status: 'success' as const,
            message: 'Profile updated successfully',
            data: updatedData,
        };
    } catch (error: any) {
        console.error('Error updating user profile:', error?.message);

        // Prisma error code P2025: Record to update not found
        if (error?.code === 'P2025') {
            return {
                status: 'error' as const,
                message: 'There is no user with this email',
            };
        }

        return {
            status: 'error' as const,
            message: error?.message || 'An unexpected error occurred',
        };
    }
}

//update user profile photo
export async function updateProfilePhoto(formData: FormData) {
    const avatar = formData.get('avatar') as File | null;
    const email = formData.get('email') as string | null;

    if (!email || !avatar || avatar.size === 0) {
        return {
            status: 'error' as const,
            message: 'Email and valid photo file are required',
        };
    }

    try {
        const { url } = await uploadAndUpdateUserPhoto(email, avatar);

        return {
            status: 'success' as const,
            message: 'Profile photo updated successfully',
            url,
        };
    } catch (error: any) {
        console.error('Error in uploading image:', error?.message);

        if (error?.code === 'P2025') {
            return {
                status: 'error' as const,
                message: 'There is no user with this email',
            };
        }

        return {
            status: 'error' as const,
            message: error?.message || 'Failed to update profile photo',
        };
    }
}