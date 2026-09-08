import PublicFooter from "@/components/ui/PublicFooter"
import PublicHeader from "@/components/ui/PublicHeader"


function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <PublicHeader />
            {children}
            <PublicFooter />
        </div>
    )
}

export default PublicLayout