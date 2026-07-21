import { Globe, Heart, Mail } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

function PublicFooter() {
    return (
        <footer className="relative border-t border-border bg-secondary/50 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex gap-12 flex-col md:flex-row md:justify-between md:gap-16 mb-12">
                    <div className="md:w-1/3">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                width={240}
                                height={56}
                                src="/logo-light.svg"
                                alt="Company Logo"
                                priority
                                className="dark:hidden object-contain"
                            />
                            <Image
                                width={240}
                                height={56}
                                src="/logo-dark.svg"
                                alt="Company Logo"
                                priority
                                className="hidden dark:block object-contain"
                            />
                        </Link>
                        <p className="text-muted-foreground text-sm">
                            Multi-store order logistics and delivery fleet tracking for modern merchants.
                        </p>
                    </div>
                    <div className="flex-1 grid gap-12 mb-12 md:grid-cols-3 md:justify-items-end md:mb-0">
                        <div className='flex flex-col items-start'>
                            <h3 className="font-semibold text-foreground mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="#features" className="text-muted-foreground hover:text-primary transition text-sm">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="text-muted-foreground hover:text-primary transition text-sm">
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col items-start'>
                            <h3 className="font-semibold text-foreground mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition text-sm">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-muted-foreground hover:text-primary transition text-sm">
                                        About
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className='flex flex-col items-start'>
                            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition text-sm">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition text-sm">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/help" className="text-muted-foreground hover:text-primary transition text-sm">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

                <div className="border-t border-border pt-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-muted-foreground text-sm">
                            © 2026 OpsCommerce. All rights reserved.
                        </p>

                        <div className="flex items-center gap-6">
                            <Link href="mailto:hello@opscommerce.com" className="text-muted-foreground hover:text-primary transition">
                                <Mail className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition">
                                <Heart className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition">
                                <Globe className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default PublicFooter