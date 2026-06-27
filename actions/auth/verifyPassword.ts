'use server'

import dbConnect from "@/dbConnect";
import User from "@/models/userModel";
import bcrypt from "bcrypt";

async function verifyUser({ email, password }: { email: string, password: string }) {
    await dbConnect();
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return null;
        }
        //compare the password
        const res = await bcrypt.compare(password, user?.password || "");

        if (res) {
            return {
                id: user?._id.toString(),
                role: user?.role,
                email: user?.email,
                name: user?.name,
                image: user?.image,
                emailVerified: user?.emailVerified
            };
        } else {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in verifying user: ', error?.message);
        return null;
    }
};

export {
    verifyUser
}