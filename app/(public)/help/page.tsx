import { Button } from '@/components/shadcn/button'
import { BookOpen, ChevronDown, Mail, Zap } from 'lucide-react'

export default function SupportPage() {
    const articles = [
        {
            category: 'Getting Started',
            articles: [
                'How to connect your Shopify store',
                'How to connect your WooCommerce store',
                'Inviting and onboarding your delivery drivers',
                'Understanding your main dispatch dashboard',
            ],
        },
        {
            category: 'Dispatch & Driver Logistics',
            articles: [
                'Assigning store orders to your drivers',
                'Managing live driver delivery queues',
                'Logging cash-on-delivery (COD) collections',
                'Tracking real-time fulfillment updates',
            ],
        },
        {
            category: 'Troubleshooting',
            articles: [
                'Fixing multi-store sync connection errors',
                'Understanding webhook delivery failures',
                'Managing active Shopify API permissions',
                'How to reset team or driver credentials',
            ],
        }
    ]

    const faqs = [
        {
            q: 'How long does setup typically take?',
            a: 'Most merchants can be fully set up in under 2 hours. We provide step-by-step onboarding and support every step of the way.',
        },
        {
            q: 'Can I integrate more than 2 stores?',
            a: 'Yes. The Starter plan includes up to 2 store integrations, while the Professional plan supports up to 5 stores. If you manage a larger logistics setup across more stores, reach out directly and we can scale your dashboard limits.',
        },
        {
            q: 'How do I handle returns and refunds?',
            a: 'OpsCommerce focuses strictly on outbound delivery logistics and driver dispatch. Returns, customer refunds, and inventory restocking are handled directly inside your native Shopify or WooCommerce store backends.',
        },
        {
            q: 'Is my data secure?',
            a: 'Yes. We connect directly to your store platforms using standard, secure API tokens and webhooks. We only pull the necessary customer address and order payload data required to generate delivery queues for your drivers.',
        },
        {
            q: 'Can I access OpsCommerce on mobile?',
            a: 'Absolutely. The dispatcher dashboard is fully responsive, and the driver delivery view is optimized specifically for mobile web browsers so your fleet can update order statuses smoothly on the road.',
        },
        {
            q: 'What happens if I hit my order limit?',
            a: 'We keep your delivery fleet moving. If you consistently cross your plan\'s limit, we\'ll gently prompt you to upgrade, but we won\'t abruptly cut off your active driver queues mid-route.',
        },
    ]

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Theme-sensitive Ambient Glow Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl opacity-75 dark:opacity-40"></div>
                    <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-tr from-accent/15 via-transparent to-transparent rounded-full blur-3xl opacity-75 dark:opacity-30"></div>
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                        Help & Support
                        <br />
                        <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                            We&apos;re Here to Help
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Get step-by-step setup guides or reach out directly for priority developer assistance.
                    </p>

                    {/* Styled Search Bar Input */}
                    {/* <div className="relative max-w-2xl mx-auto group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Search help articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/40 dark:bg-card/20 border border-slate-200 dark:border-white/[0.1] text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 backdrop-blur-md"
                        />
                    </div> */}
                </div>
            </section>

            {/* SUPPORT HUB OPTIONS */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 mb-16">
                        {[
                            {
                                icon: BookOpen,
                                title: 'Documentation',
                                description: 'Browse our clear, step-by-step guides to connect your Shopify or WooCommerce stores in minutes.',
                                cta: 'Explore Docs',
                            },
                            {
                                icon: Mail,
                                title: 'Email Support',
                                description: 'Have a specific technical question or operational setup issue? Get support directly from the platform developer.',
                                cta: 'Get Help',
                            },
                        ].map((option, i) => {
                            const Icon = option.icon
                            return (
                                <div
                                    key={i}
                                    className="p-8 rounded-2xl border transition-all duration-300 shadow-sm bg-white/60 dark:bg-card/40 backdrop-blur-md border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] hover:shadow-md"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2">{option.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed min-h-[40px]">{option.description}</p>
                                    <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 rounded-xl font-bold cursor-pointer transition-all duration-200">
                                        {option.cta}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* POPULAR ARTICLES GRID */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-12 text-foreground">Popular Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((category, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-2xl border transition-all duration-300 bg-white/40 dark:bg-card/20 border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] hover:shadow-sm"
                            >
                                <h3 className="text-base font-bold text-primary uppercase tracking-wider mb-5">{category.category}</h3>
                                <ul className="space-y-4">
                                    {category.articles.map((article, j) => (
                                        <li key={j} className="flex items-start">
                                            <button className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium text-left leading-relaxed cursor-pointer hover:underline">
                                                {article}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACCORDION FAQ SECTION */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight mb-12 text-center text-foreground">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group border rounded-2xl transition-all duration-300 bg-white/40 dark:bg-card/20 border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                            >
                                <summary className="flex items-center justify-between font-bold text-foreground outline-none select-none">
                                    <span className="pr-4 leading-snug">{faq.q}</span>
                                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                                </summary>
                                <div className="border-t border-slate-200/60 dark:border-white/[0.06] mt-4 pt-4">
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER: FORUM COMMUNITY SECTION
            <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-white/[0.08] mt-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/40 dark:bg-card/25 border border-slate-200/80 dark:border-white/[0.08] rounded-3xl backdrop-blur-md p-8 md:p-12 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Join Our Merchant Community</h3>
                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                                    Connect with thousands of other merchants using OpsCommerce. Share operations strategies, workflows, and learn best practices from seasoned platform users.
                                </p>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 rounded-xl font-bold shadow-md shadow-primary/25 cursor-pointer transition-all duration-200">
                                    Join Community Forum
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* RADIAL ASSISTANCE CALLOUT SECTION */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-6">
                        <Zap className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-xs font-bold text-primary tracking-wider uppercase">DIRECT SUPPORT</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">Can&apos;t Find What You Need?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        Get in touch directly with the developer behind the platform. Reach out via email and you&#39;ll receive a detailed response within 24 hours.
                    </p>
                    <div className="flex justify-center items-center">
                        <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all duration-300 cursor-pointer">
                            Email the Developer
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}