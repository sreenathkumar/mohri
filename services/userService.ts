import prisma from '@/lib/prisma';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi({});

export interface UpdateProfileParams {
    email: string;
    name?: string;
    address?: string;
    phone?: string;
}

/**
 * Fetch user details by ID
 */
export async function findUserById(userId: string) {
    if (!userId) return null;

    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            address: true,
            phone: true,
            role: true,
        },
    });
}

/**
 * Update basic user profile fields by email
 */
export async function updateUserProfile({ email, name, address, phone }: UpdateProfileParams) {
    return await prisma.user.update({
        where: { email },
        data: {
            ...(name && { name }),
            ...(address && { address }),
            ...(phone && { phone }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            address: true,
            phone: true,
        },
    });
}

/**
 * Upload image file to UploadThing and update user record
 */
export async function uploadAndUpdateUserPhoto(email: string, avatarFile: File) {
    const response = await utapi.uploadFiles(avatarFile);

    if (response.error || !response.data) {
        throw new Error(response.error?.message || 'Failed to upload image');
    }

    const { url } = response.data;

    const updatedUser = await prisma.user.update({
        where: { email },
        data: { image: url },
    });

    return { url, user: updatedUser };
}