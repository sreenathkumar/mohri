import { ShoppingCart, Users, TrendingUp, BarChart3, Lock, Zap } from 'lucide-react'

const features = [
    {
        icon: ShoppingCart,
        title: 'Multi-Store Orders',
        description: 'Sync and manage orders from Shopify and WooCommerce in a single unified dashboard.',
    },
    {
        icon: Users,
        title: 'Delivery Team Management',
        description: 'Assign, track, and optimize your delivery team performance in real-time.',
    },
    {
        icon: TrendingUp,
        title: 'Cash Reconciliation',
        description: 'Easily log cash-on-delivery payments, track driver collection totals, and settle trip balances.',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Track order volumes, driver performance, and overall payout metrics instantly.',
    },
    {
        icon: Lock,
        title: 'Isolated Workspaces',
        description: 'Complete multi-tenant data isolation and secure cryptographic team onboarding',
    },
    {
        icon: Zap,
        title: 'Automated Dispatch',
        description: 'Instantly trigger driver notifications, delivery queue assignments, and webhooks.',
    },
]

export default function FeaturesSection() {
    return (
        <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        Powerful Features for Modern Merchants
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to manage your ecommerce operations at scale.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </div>

                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
