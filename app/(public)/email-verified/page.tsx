import { Mail } from "lucide-react";
import Link from "next/link";
import ResendBtn from "./components/resend-btn";
import { auth } from "@/lib/auth";

interface PageProps {
    searchParams: Promise<{
        error?: string;
    }>;
}

async function VerifyEmail({ searchParams }: PageProps) {
    const session = await auth.api.getSession();
    console.log("VerifyEmail session:", session);
    const { error } = await searchParams;

    if (error === "TOKEN_EXPIRED") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
                            Verification Failed
                        </h1>
                        <p className="text-muted-foreground text-center mb-8">
                            The verification link is invalid or has expired.
                        </p>
                        <div className="text-center">
                            <ResendBtn />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // when the user email is not verified, show the resend link UI
    if (error === "NOT_VERIFIED") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                <div className="relative z-10">
                    <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                                <Mail className="w-12 h-12 text-primary relative" />
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
                            Check Your Email
                        </h1>
                        <p className="text-muted-foreground text-center mb-8">
                            We&apos;ve sent a verification link to
                        </p>

                        {/* Instructions */}
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 space-y-2">
                            <p className="text-sm font-medium text-foreground">Click the link in your email to verify your account.</p>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>The link expires in 24 hours</li>
                                <li>Check your spam folder if you don&apos;t see it</li>
                            </ul>
                        </div>

                        {/* Resend Section */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Didn&apos;t receive the link?
                            </p>
                            <ResendBtn />
                        </div>

                        {/* Back to Login */}
                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already verified?{' '}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Go to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // when the user email is verified, show the success UI
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
                    Email Verified Successfully
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Your email has been verified successfully. You can now access your account.
                </p>
                <div className="text-center">
                    <Link href='/dashboard' className="text-primary hover:text-primary/80 font-medium transition-colors">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail