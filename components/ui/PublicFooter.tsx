import Link from "next/link"

function PublicFooter() {
    return (
        <footer className="border-t border-muted bg-background">
            <div className="container max-w-(--breakpoint-2xl) px-4 py-6 md:px-8 md:py-0">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">© 2025 <Link className="underline" href='sreenathkumar.vercel.app'>Sreenath Kumar</Link>. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default PublicFooter