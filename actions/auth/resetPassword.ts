'use server'

import dbConnect from "@/dbConnect";
import { generateOTP } from "@/lib/utils";
import OTP from "@/models/OTPModel";
import User from "@/models/userModel";
import { z } from "zod";
import { sendOTPMail } from "../sendEmail";
import { saltAndHashPassword } from "@/lib/password";

// Allowed email domains
const allowedEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

// Form schema for validating the email field
const formSchema = z.object({
    email: z.string().email().refine((email) => {
        // Extract the domain from the email
        const domain = email.split('@')[1];
        // Check if the domain is in the allowed list
        return allowedEmailDomains.includes(domain);
    }, {
        message: 'Only Gmail, Yahoo, and Outlook emails are allowed.',
    }),
});

//form shema for validating the otp
const otpSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be at least 6 characters long" }),
});

// password schema
const passwordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters long"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // This specifies where the error should appear
    });


// function to send the otp as email
export async function sendOTP(prevState: unknown, formData: FormData) {
    const { email } = Object.fromEntries(formData);

    if (!email) return { status: 'error', message: "Email is required" }


    const validatedFields = formSchema.safeParse({ email });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            status: 'error',
            message: "Invalid form data",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    //connect to the database
    await dbConnect();


    //check if the user already exists
    const user = User.findOne({ email });

    if (!user) {
        return {
            status: 'error',
            message: "There is no user with this email",
            errors: {
                email: ["There is no user with this email"]
            }
        }
    }
    try {
        //check if the otp already exists and delete it
        const existingOTP = await OTP.findOne({ email });

        if (existingOTP) {
            await OTP.deleteOne({ email });
        }

        //generate the otp
        let otp = generateOTP();

        //check if the otp already exists 
        const otpExists = await OTP.find({ email, code: otp });

        if (otpExists.length > 0) {
            otp = generateOTP();
        }

        //save the otp to the database
        const newOTP = new OTP({ email, code: otp });
        await newOTP.save();

        // send OTP as email
        const isOTPSent = await sendOTPMail(email as string, otp);

        if (isOTPSent) {
            return {
                status: 'success',
                message: 'OTP sent successfully'
            }
        } else {
            return {
                status: 'error',
                message: 'Error in sending OTP'
            }
        }
    }
    catch (error: unknown) {
        console.log(error);
        return {
            status: 'error',
            message: 'Unexpected error',
        }
    }

}

// function to verify the otp
export async function verifyOTP(prevState: unknown, formData: FormData) {
    const { otp } = Object.fromEntries(formData);
    const validatedFields = otpSchema.safeParse({ otp });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: "Invalid OTP",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    //connect to the database
    await dbConnect();

    //find the otp
    try {
        const isOTPExists = await OTP.findOne({ code: otp });

        if (!isOTPExists) {
            return {
                status: 'error',
                message: "Invalid OTP",
            }
        }

        //delete the otp
        await OTP.deleteOne({ code: otp });

        return {
            status: 'success',
            message: 'OTP verified successfully'
        }

    } catch (error) {
        console.log('error in verifying otp: ', error);
        return {
            status: 'error',
            message: 'Unexpected error in verifying otp',
        }
    }
}

// function to reset the password
export async function resetPassword(prevState: unknown, formData: FormData) {
    const { email, password, confirmPassword } = Object.fromEntries(formData);
    const validatedFields = passwordSchema.safeParse({ password, confirmPassword });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Invalid password',
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    //connect to the database
    await dbConnect();


    try {
        //find the user
        const user = await User.findOne({ email });

        if (!user) {
            return {
                status: 'error',
                message: "There is no user with this email",
                errors: {
                    password: ["There is no user with this email"],
                    confirmPassword: ["There is no user with this email"]
                }
            }
        }

        //hash the password
        const hashedPassword = await saltAndHashPassword(password as string);

        //update the password
        user.password = hashedPassword;

        //save the user
        await user.save();

        return {
            status: 'success',
            message: 'Password reset successfully'
        }
    } catch (error) {
        console.log('error in resetting password: ', error);
        return {
            status: 'error',
            message: 'Unexpected error in resetting password'
        }
    }

    return {
        status: 'success',
        message: 'Password reset successfully'
    }
}


