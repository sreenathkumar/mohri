'use server'

import { auth } from "@/lib/auth";
import z from "zod";

const passwordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // This specifies where the error should appear
    });


export async function resetPassword(formData: FormData) {
    const { token, password, confirmPassword } = Object.fromEntries(formData);

    //if the token is not present, return error
    if (!token) {
        return {
            status: 'error',
            message: 'Token is mandatory',
        }
    }

    const validatedFields = passwordSchema.safeParse({ password, confirmPassword });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Invalid password',
            errors: validatedFields.error.flatten().fieldErrors
        }
    }
    try {
        const data = await auth.api.resetPassword({
            body: {
                token: token as string,
                newPassword: validatedFields.data.password
            }
        });

        console.log('resetPassword data: ', data);

        if (!data.status) {
            throw new Error('Failed to reset password');
        }

        return {
            status: 'success',
            message: 'Password reset successfully',
        }
    } catch (error: any) {
        console.error('[resetPassword] error during reseting password: ', error.message);
        throw error
    }
}