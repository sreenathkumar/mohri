'use server'

import dbConnect from "@/dbConnect";
import User from "@/models/userModel";
import { UserProfileType } from "@/types/UserType";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi({});

async function getUser({ userId }: { userId: string }) {
    //check if userId exist
    if (!userId) {
        return null
    }

    try {
        //connect to the database
        await dbConnect();

        //query the database for the user with the given userId
        const user = await User.findOne({ _id: userId }).select(['name', 'email', 'image', 'address', 'phone', 'role']);

        if (!user) {
            return null
        }

        return {
            name: user.name,
            email: user.email,
            image: user.image,
            address: user.address,
            phone: user.phone,
        }


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in getting user: ', error?.message);
        return null
    }
}

async function updateProfile({ email, name, address, phone }: { email: string, name?: string, address?: string, phone?: string }) {
    const data = {
        name,
        address,
        phone
    }

    try {
        //connect database
        await dbConnect();

        //update the user
        const user = await User.findOneAndUpdate({ email }, { $set: data }, { new: true });

        if (!user) {
            return {
                status: 'error',
                message: "There is no user with this email",
            }
        }

        const updatedData: UserProfileType = {
            id: user._id.toString(),
            name: user.name,
            address: user.address,
            phone: user.phone,
            image: user.image,
            email: user.email
        }

        return {
            status: 'success',
            message: "Profile updated successfully",
            data: updatedData
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in updating user: ', error?.message);
        return {
            status: 'error',
            message: error?.message,
        }
    }


}

async function updateProfilePhoto(formdata: FormData) {
    //get the image from the formdata
    const avatar = formdata.get('avatar') as File;
    const email = formdata.get('email') as string;

    //upload it to uploadthing
    if (email && avatar) {
        try {
            const response = await utapi.uploadFiles(avatar);

            if (!response.error && response.data) {
                const { url } = response.data;

                //update the user in the database
                await dbConnect();

                const user = await User.findOneAndUpdate({ email }, { $set: { image: url } }, { new: true });

                if (!user) {
                    return {
                        status: 'error',
                        message: "There is no user with this email",
                    }
                }

                return {
                    status: 'success',
                    message: "Profile photo updated successfully",
                    url: url
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log('error in uploading image: ', error.message);
            return {
                status: 'error',
                message: error.message
            }
        }

    }
}

export { getUser, updateProfile, updateProfilePhoto };
