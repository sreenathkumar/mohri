import { auth } from '@/auth';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../shadcn/avatar';
import { Button } from '../shadcn/button';
import { DropdownMenu, DropdownMenuTrigger } from '../shadcn/dropdown-menu';
import UserMenu from './UserMenu';

async function PublicHeader() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-muted bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center justify-between px-4 mx-auto">
                {/* Logo */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-semibold text-lg">Order Management</span>
                    </Link>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/help"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Help
                    </Link>
                    <Link
                        href="/privacy-policy"
                        className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Privacy policy
                    </Link>

                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                                    <AvatarFallback className="rounded-lg bg-background">{session?.user?.name[0]?.toLocaleUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <UserMenu userEmail={session.user.email} userImage={session.user.image} userName={session.user.name} isMobile={true} userRole={session.user.role} />
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Link href="/login" className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                Login
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    )
}


export default PublicHeader