'use server';

import { getRequiredSessionContext } from '@/lib/auth-context';
import {
    UpdateProfileParams,
    fetchCurrentUser,
    updateUserProfile,
    uploadAndUpdateUserPhoto,
} from '@/services/userService';
import { success } from 'better-auth';

/**
 * Get the current user data from the server
 * @returns user data object
 */
export async function getCurrentUser() {
    try {
        const { userId, organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager', 'driver']
        })
        const user = await fetchCurrentUser({ userId, organizationId });

        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user.user.id,
            name: user.user.name,
            email: user.user.email,
            image: user.user.image,
            address: user.user.address,
            phone: user.user.phone,
            role: user.role,
        }
    } catch (error: any) {
        console.error('[getCurrentUser] Error fetching user:', error?.message);
        return null;
    }
}

export type UserType = Awaited<ReturnType<typeof getCurrentUser>>;//the type of the current user

/**
 * Update the user profile data on the server
 * @param params updated data parameters(i.e name, address, phone)
 * @returns updated user data object
 */
export async function updateProfile(params: UpdateProfileParams) {
    try {
        const { role } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager', 'driver']
        });
        const updatedUser = await updateUserProfile(params);

        return {
            success: true,
            message: 'Profile updated successfully',
            data: {
                ...updatedUser,
                role,
            },
        };
    } catch (error: any) {
        console.error('Error updating user profile:', error?.message);

        // Prisma error code P2025: Record to update not found
        if (error?.code === 'P2025') {
            return {
                success: false,
                message: 'There is no user with this email',
            };
        }

        return {
            success: false,
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