'use client'

import { Alert, AlertDescription } from "@/components/shadcn/alert"
import { Input } from "@/components/shadcn/input"
import FormField from '@/components/ui/CustomField'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PasswordField from './PasswordField'
import SubmitBtn from "./SubmitBtn"

function LoginForm() {
    const router = useRouter();
    const [formState, setFormState] = useState<{ errors: { email?: string[], password?: string[] } | null, message: string | null }>({ errors: null, message: null });

    //============================
    // Login user
    //============================
    const handleLogin = async (data: FormData) => {
        const formData = Object.fromEntries(data);
        try {
            const res = await signIn("credentials", { ...formData, redirect: false });

            if (res?.error) {
                setFormState({
                    errors: {
                        email: ['Invalid credentials'],
                        password: ['Invalid credentials'],
                    },
                    message: "Please check your credentials. If you don't have an account, please sign up.",
                });
                return
            }

            router.push('/dashboard');
            router.refresh();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log('error: ', error);
            setFormState({
                errors: {
                    email: ['Unknown error'],
                    password: ['Unknown error'],
                },
                message: error.message,
            });
        }
    };
    return (
        <form className="mt-8 space-y-6" action={handleLogin}>
            {formState?.errors && (
                <Alert variant="destructive">
                    <AlertDescription>{formState?.message}</AlertDescription>
                </Alert>
            )}
            <div>
                <FormField label='Email address' htmlFor="email" error={formState?.errors?.email}>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-1"
                    />
                </FormField>
                <FormField label='Password' htmlFor="password" error={formState?.errors?.password}>
                    <PasswordField />
                </FormField>
            </div>

            <Link href="/reset-password" className="text-gray-600 text-sm hover:underline">
                Forgot your password?
            </Link>

            <SubmitBtn text='Sign in' loadingText='Singing in...' />

        </form>
    )
}

export default LoginForm