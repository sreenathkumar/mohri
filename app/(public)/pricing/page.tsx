'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Check, ChevronDown } from 'lucide-react'

export default function PricingPage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null)

    const plans = [
        {
            name: 'Starter',
            price: '$19',
            period: '/month',
            description: 'Perfect for local businesses just starting out with delivery tracking.',
            features: [
                'Up to 2 store integrations',
                '1,000 orders/month',
                'Core multi-store sync dashboard',
                'Basic driver & route logging',
                'Email support',
            ],
            cta: 'Start Free Trial',
            highlight: false,
        },
        {
            name: 'Professional',
            price: '$49',
            period: '/month',
            description: 'For growing e-commerce brands managing an active local delivery fleet.',
            features: [
                'Up to 5 store integrations',
                '10,000 orders/month',
                'Advanced driver dispatch queues',
                'Driver cash-collect tracking',
                'Live tracking update webhooks',
                'Priority developer email support',
                'Custom integration support',
            ],
            cta: 'Start Free Trial',
            highlight: true,
        }
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
                        Simple, Transparent
                        <br />
                        <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                            Pricing
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Choose the perfect plan for your business. All plans include a 14-day free trial with full feature access. No credit card required.
                    </p>
                </div>
            </section>

            {/* PRICING GRID */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                        {plans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative group rounded-3xl transition-all duration-300 flex flex-col ${plan.highlight ? 'md:-translate-y-2 z-10' : 'hover:-translate-y-1 z-0'
                                    }`}
                            >
                                {/* Glowing Backlight behind Most Popular Card */}
                                {plan.highlight && (
                                    <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-orange-500/20 rounded-[28px] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}

                                {/* HYBRID GLASSY CARD CONTAINER */}
                                <div
                                    className={`relative h-full rounded-3xl border p-8 flex flex-col transition-all duration-300 shadow-sm ${plan.highlight
                                        ? 'bg-card border-primary shadow-xl shadow-primary/5'
                                        : 'bg-white/60 dark:bg-card/40 backdrop-blur-md border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] hover:shadow-xl'
                                        }`}
                                >
                                    {plan.highlight && (
                                        <div className="inline-flex w-fit px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-6">
                                            <span className="text-xs font-bold text-primary tracking-wider uppercase">MOST POPULAR</span>
                                        </div>
                                    )}

                                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">{plan.name}</h3>
                                    <p className="text-muted-foreground text-sm mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                                            <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>
                                        </div>
                                    </div>

                                    {/* Action CTA Button */}
                                    <Button
                                        className={`w-full mb-8 py-6 rounded-xl font-bold transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer ${plan.highlight
                                            ? 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.01] shadow-lg shadow-primary/25'
                                            : 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10'
                                            }`}
                                        variant={plan.highlight ? 'default' : 'outline'}
                                    >
                                        {plan.cta}
                                    </Button>

                                    {/* Features Listing */}
                                    <div className="border-t border-slate-200/80 dark:border-white/[0.08] pt-6 flex-grow flex flex-col">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-5">Included features</p>
                                        <ul className="space-y-4 flex-grow">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                                        <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground leading-relaxed font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-center tracking-tight text-foreground mb-16">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            q: 'How does the multi-store order sync work?',
                            a: 'OpsCommerce connects directly to your Shopify and WooCommerce stores using secure API keys. The moment an order is placed on either platform, it instantly populates in your unified dispatch dashboard without manual data entry.',
                        },
                        {
                            q: 'Do my delivery drivers need to create an account?',
                            a: 'Yes, drivers need an account to securely access their delivery queues, but there is no extra fee per driver seat. Merchants can easily send secure invitations from the dashboard, and drivers can create their free profile and accept the invite in seconds.',
                        },
                        {
                            q: 'What happens if I go over my monthly order limit?',
                            a: 'We won\'t abruptly shut down your dashboard or leave your drivers stranded mid-route. If you consistently exceed your limit, we\'ll gently prompt you to upgrade to the next tier, but we keep your operations running smoothly.',
                        },
                        {
                            q: 'Can I track Cash on Delivery (COD) payments?',
                            a: 'Yes. While the app does not automatically settle accounts with your bank, it features a dedicated operational ledger. Dispatchers can easily log exact cash amounts collected by drivers at the doorstep and settle trip balances at the end of the shift.',
                        },
                        {
                            q: 'Is there a setup fee or a minimum contract?',
                            a: 'Absolutely not. OpsCommerce is completely bootstrapped and independent. You pay monthly, there are zero hidden setup fees, and you can cancel your subscription at any time with a single click from your account settings.',
                        },
                        {
                            q: 'Which platforms do you natively support right now?',
                            a: 'We focus entirely on providing robust, stable sync functionality for Shopify and Core WooCommerce installations.',
                        }
                    ].map((faq, i) => {
                        const isOpen = openFAQ === i;
                        return (
                            <div
                                key={i}
                                className="border border-border rounded-2xl bg-card overflow-hidden transition-all duration-300 hover:border-muted-foreground/30 shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:bg-muted/50 text-left"
                                >
                                    <h3 className="font-bold text-foreground pr-4 leading-snug">{faq.q}</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
                                        } overflow-hidden`}
                                >
                                    <div className="px-6 pb-6 border-t border-border pt-4 bg-muted/10">
                                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    )
}