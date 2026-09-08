'use client'

import { Input } from "@/components/shadcn/input"
import FormField from '@/components/ui/CustomField'
import { signIn } from "@/lib/auth-client"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import PasswordField from './PasswordField'
import SubmitBtn from "./SubmitBtn"
import { toast } from "sonner"

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('callbackUrl');

    const handleLogin = async (formdata: FormData) => {
        try {
            await signIn.email({
                email: formdata.get('email') as string,
                password: formdata.get('password') as string,
                rememberMe: true,
                callbackURL: redirectUrl || '/continue',
            }, {
                onError: (ctx) => {
                    if (ctx.error.status === 403) {
                        router.push('/email-verified?error=NOT_VERIFIED')
                    }

                    toast.error(ctx.error.message || 'Something went wrong in signing in. Please try again later.');
                }
            });

        } catch (err: any) {
            toast.error(err?.message || 'Something went wrong. Please try again later.');
        }
    };

    return (
        <form className="mt-8 space-y-6" action={handleLogin}>
            <div className="space-y-4">
                <FormField label='Email address' htmlFor="email">
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    />
                </FormField>
                <FormField label='Password' htmlFor="password">
                    <PasswordField />
                </FormField>
            </div>

            <Link href="/reset-password" className="block text-muted-foreground text-sm mb-2 hover:underline">
                Forgot your password?
            </Link>

            <SubmitBtn text='Sign in' loadingText='Singing in...' />
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-card/50 text-muted-foreground">or</span>
                </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary hover:text-primary/90 font-semibold transition">
                    Sign up
                </Link>
            </p>
        </form>
    )
}

export default LoginForm