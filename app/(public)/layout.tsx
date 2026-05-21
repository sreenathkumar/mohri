import PublicFooter from "@/components/ui/PublicFooter"
import PublicHeader from "@/components/ui/PublicHeader"
import { SessionProvider } from "next-auth/react"


function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <SessionProvider>
                <PublicHeader />
                {children}
                <PublicFooter />
            </SessionProvider>
        </div>
    )
}

export default PublicLayout