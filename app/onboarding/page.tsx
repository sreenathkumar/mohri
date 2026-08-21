import { getServerSession } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import LoggedInState from "./components/logged-in-state";
import LoggedOutState from "./components/logged-out-state";

interface OnboardingPageProps {
    searchParams: Promise<{
        invitationId?: string;
    }>
}

async function OnboardingPage({ searchParams }: OnboardingPageProps) {
    const { invitationId } = await searchParams;
    const session = await getServerSession();

    return (
        <main className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between p-4 md:p-6 font-sans">
            {/* Minimal Header */}
            <header className="w-full max-w-5xl mx-auto flex justify-center py-4">
                <Link href={'/'} className="flex items-[#F97316] gap-2 items-center">
                    <Image src="/logo-dark.svg" alt="Better Auth Logo" width={240} height={48} />
                </Link>
            </header>

            {/* Main Content Card */}
            <section className="flex-1 flex items-center justify-center py-8">
                {
                    session?.user ? <LoggedInState session={session} invitationId={invitationId} /> : <LoggedOutState invitationId={invitationId} />
                }
            </section>

            {/* Minimal Clean Footer */}
            <footer className="w-full max-w-md mx-auto text-center py-4 space-y-2">
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                    <Link href="/support" className="hover:text-slate-400 transition-colors">
                        Report Issue
                    </Link>
                    <span>•</span>
                    <Link href="/privacy" className="hover:text-slate-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:text-slate-400 transition-colors">
                        Terms of Service
                    </Link>
                </div>
                <p className="text-[11px] text-slate-600">
                    © {new Date().getFullYear()} OpsCommerce, Inc. All rights reserved.
                </p>
            </footer>
        </main>
    );
}

export default OnboardingPage;