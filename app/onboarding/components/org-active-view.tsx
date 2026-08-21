import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card"
import { ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"


function OrgExists({ dashUrl }: { dashUrl: string }) {
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="space-y-2 text-center">
                <div className="mx-auto w-12 h-12 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-[#F97316]" />
                </div>
                <CardTitle className="text-2xl font-semibold text-primary-foreground tracking-tight">
                    Organization Exists.
                </CardTitle>
                <CardDescription className="text-sm text-slate-400">
                    You already have an active organization. Please go to your dashboard to manage your organization and its members.
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
                <Link className="w-full py-3 px-4 bg-primary hover:bg-primary/50 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2" href={dashUrl}>
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </CardContent>
        </Card>
    )
}

export default OrgExists