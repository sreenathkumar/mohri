import { Button } from '@/components/shadcn/button'
import { ArrowRight, Sparkles, Rocket, Globe, Layers } from 'lucide-react'

export default function AboutPage() {
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
                        Empowering Local
                        <br />
                        <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                            Deliveries
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                        OpsCommerce was built to solve the real-world chaos of managing multi-store orders and coordinating local delivery fleets from a single dashboard.
                    </p>
                </div>
            </section>

            {/* STORY SECTION */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Our Story</h2>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                OpsCommerce was born out of a simple observation: e-commerce merchants running both Shopify and WooCommerce stores spend far too much time jumping between different dashboards just to organize local delivery routes.
                            </p>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                We saw merchants struggling to manually coordinate dispatch runs, keep track of drivers on the road, and maintain accurate cash logs for cash-on-delivery shipments. The existing enterprise logistics tools were too complex, expensive, and bloated.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We built OpsCommerce as a focused, utility-first platform. By combining multi-store syncing with clean driver dispatch workflows, we help merchants cut out the noise and handle their daily deliveries with ease.
                            </p>
                        </div>

                        {/* Hybrid Glass Timeline Box */}
                        <div className="p-8 sm:p-10 rounded-3xl border transition-all duration-300 shadow-sm bg-white/60 dark:bg-card/40 backdrop-blur-md border-slate-200/80 dark:border-white/[0.08]">
                            <div className="space-y-6">
                                <div>
                                    <div className="text-4xl font-extrabold text-primary mb-2 tracking-tight">2026</div>
                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">Launched with a singular mission: to simplify local e-commerce delivery logistics.</p>
                                </div>
                                <div className="border-t border-slate-200/80 dark:border-white/[0.08] pt-6">
                                    <div className="text-4xl font-extrabold text-primary mb-2 tracking-tight">100%</div>
                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">Bootstrapped, self-funded, and built completely independent.</p>
                                </div>
                                <div className="border-t border-slate-200/80 dark:border-white/[0.08] pt-6">
                                    <div className="text-4xl font-extrabold text-primary mb-2 tracking-tight">Always</div>
                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">Directly shaped by merchant feedback, lightweight, and built for speed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MISSION SECTION */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/40 dark:bg-card/20 backdrop-blur-md p-8 md:p-16 text-center shadow-sm overflow-hidden">

                        {/* Soft localized background glow */}
                        <div className="absolute -inset-10 bg-primary/5 rounded-3xl blur-3xl opacity-30 pointer-events-none" aria-hidden="true" />

                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 relative z-10">Our Mission</h2>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed relative z-10">
                            To empower local e-commerce merchants with straightforward logistics tools that centralize multi-store orders, simplify dispatching, and streamline delivery tracking.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            {[
                                {
                                    icon: Rocket,
                                    title: 'Simplify',
                                    description: 'Manage complex delivery workflows with an intuitive, clean interface built for speed.',
                                },
                                {
                                    icon: Layers,
                                    title: 'Unify',
                                    description: 'Bring your Shopify and WooCommerce orders into a single, unified dispatch dashboard.',
                                },
                                {
                                    icon: Globe,
                                    title: 'Scale',
                                    description: 'Empower merchants to scale order volumes without losing track of their delivery fleet.',
                                },
                            ].map((value, i) => {
                                const Icon = value.icon
                                return (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className="relative py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-16 text-center">Our Core Values</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Merchant First',
                                description: 'Every feature is shaped by direct merchant feedback. You get a direct line to the person building your platform.',
                            },
                            {
                                title: 'Honest & Open',
                                description: 'No corporate sales walls, no hidden fees, and transparent pricing. We build openly alongside the merchants who use us.',
                            },
                            {
                                title: 'Focused Simplicity',
                                description: 'We reject bloated features. We focus strictly on building lightweight, highly intuitive tools that make local delivery smooth.',
                            },
                            {
                                title: 'Reliable Syncing',
                                description: 'Deliveries run on tight schedules. We prioritize stable store syncing, clean API webhooks, and consistent tracking uptime.',
                            },
                        ].map((value, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-2xl border transition-all duration-300 bg-white/40 dark:bg-card/20 border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-white/60 dark:hover:bg-card/30 backdrop-blur-md hover:shadow-md"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">{value.title}</h3>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">Ready to Simplify Your Deliveries?</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Start streamlining your multi-store orders and driver dispatch queues in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 cursor-pointer">
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 rounded-xl font-bold transition-all duration-300 cursor-pointer">
                            Contact Developer
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}