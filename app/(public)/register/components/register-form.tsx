'use client'

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import FormField from "@/components/ui/CustomField";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import PasswordField from "../../login/components/PasswordField";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams()

    //redirect url 
    const callbackUrl = searchParams.get('callbackUrl') || '/continue';

    const handleSignup = async (formData: FormData) => {
        const name = (formData.get('name') as string)?.trim();
        const email = (formData.get('email') as string)?.trim();
        const password = formData.get('password') as string;
        const businessName = (formData.get('businessName') as string)?.trim();

        // Basic client-side validation check
        if (!name || !email || !password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const { data: authData, error: authError } = await signUp.email({
            email,
            password,
            name,
            callbackURL: callbackUrl,
        })

        if (authError) {
            // Better Auth returns specific error messages (e.g. USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL)
            toast.error(authError.message || 'An error occurred during registration.');
            return;
        }

        router.push('/email-verified?error=NOT_VERIFIED');
    };


    return (
        <form className="mt-8 space-y-6" action={handleSignup}>
            <div className="space-y-4">
                <FormField label='Full Name' htmlFor="name" >
                    <Input
                        name="name"
                        type="name"
                        autoComplete="name"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    />
                </FormField>
                <FormField label='Email address' htmlFor="email">
                    <Input
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
                <div className="flex items-center gap-3">
                    <Input
                        type="checkbox"
                        name="terms"
                        required
                        className="w-4 h-4 rounded border-white/20 bg-white/5 cursor-pointer accent-primary"
                    />
                    <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:text-primary/90 transition">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy-policy" className="text-primary hover:text-primary/90 transition">
                            Privacy Policy
                        </Link>
                    </Label>
                </div>
            </div>
            <SubmitButton />
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
                <Link href="/login" className="text-primary hover:text-primary/90 font-semibold transition">
                    Login
                </Link>
            </p>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all" disabled={pending}>
            {pending ? 'Creating Account...' : 'Create Account'}
        </Button>
    )
}

export default RegisterForm