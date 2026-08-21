'use server';

import { auth } from '@/lib/auth';
import { getRequiredSessionContext, getServerSession } from '@/lib/auth-context';
import {
    UpdateProfileParams,
    fetchCurrentUser,
    updateUserProfile,
    uploadAndUpdateUserPhoto,
} from '@/services/userService';
import { headers } from 'next/headers';

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


export async function createOrganization(data: FormData) {
    const orgName = data.get('orgName');
    const orgSlug = data.get('orgSlug');
    const timezone = data.get('timezone');

    if (!orgName || !orgSlug) {
        console.log('OrgName or orgSlug is missing')
        return {
            success: false,
            message: 'Organization name or slug is missing.'
        }
    }
    console.log('create org triggered')
    try {
        const session = await getServerSession()

        if (!session || !session?.user.emailVerified) {
            throw new Error("Unauthenticaed request. Please login")
        }

        //check if the user is already have an organization
        const existingOrganization = await auth.api.listOrganizations({
            query: {
                userId: session.session.userId,
            },
            headers: await headers()
        });

        if (existingOrganization && existingOrganization.length > 0) {
            throw new Error('You already have an organization. You cannot create a new one.');
        }

        const result = await auth.api.createOrganization({
            body: {
                name: orgName as string,
                slug: orgSlug as string,
                userId: session.session.userId,
                timezone: timezone as string
            },
            headers: await headers()
        });

        if (!result) {
            throw new Error('Organization creation failed.')
        }

        return {
            orgId: result.id,
            success: true,
            message: 'Organization created successfully.'
        }
    } catch (error: any) {
        console.error('[createOrganization] error in creating organization.');
        return {
            success: false,
            message: error.message || 'Something went wrong when creating organization.'
        }
    }
}