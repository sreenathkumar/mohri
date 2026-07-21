'use client'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Mail, Clock, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            // STEP 2 Connection logic goes here:
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!response.ok) throw new Error('Failed to send message.')

            setIsSuccess(true)
            setFormData({ name: '', email: '', company: '', message: '' })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">

            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl opacity-75 dark:opacity-40"></div>
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
                        Get in Touch
                        <br />
                        <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                            We&apos;d Love to Help
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Have questions about OpsCommerce? Drop us a line and our support team will get right back to you.
                    </p>
                </div>
            </section>


            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    <div className="grid md:grid-cols-5 gap-12 items-start">
                        {/* Form Container (Takes 3 columns) */}
                        <div className="md:col-span-3 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/40 dark:bg-card/20 backdrop-blur-md">
                            <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Send us a Message</h2>

                            {isSuccess ? (
                                <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm">
                                        Thank you for reaching out. We have received your email and will get back to you within 24 hours.
                                    </p>
                                    <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && <p className="text-destructive text-sm font-semibold">{error}</p>}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-2">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-background/50 dark:bg-background/25 border border-slate-200 dark:border-white/[0.1] text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-background/50 dark:bg-background/25 border border-slate-200 dark:border-white/[0.1] text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Company</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-background/50 dark:bg-background/25 border border-slate-200 dark:border-white/[0.1] text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                            placeholder="Your company name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-background/50 dark:bg-background/25 border border-slate-200 dark:border-white/[0.1] text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                                            placeholder="How can we help your business?"
                                        ></textarea>
                                    </div>
                                    <Button
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 rounded-xl font-bold shadow-lg shadow-primary/25 cursor-pointer transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Direct Support Details (Takes 2 columns) */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/60 dark:bg-card/40 backdrop-blur-md">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Direct Email Support</h3>
                                <p className="text-primary font-semibold text-lg mb-3">support@opscommerce.com</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Prefer using your desktop email client? Drop us a direct message. Our inbox is checked constantly by human specialists. No endless bot loops here.
                                </p>
                            </div>

                            <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/60 dark:bg-card/40 backdrop-blur-md">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Our Response Commitment</h3>
                                <ul className="space-y-3 mt-4 text-sm text-muted-foreground font-medium">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>General Inquiries: Under 24 Hours</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Sales Discussions: Under 2 Hours</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Enterprise SLA: Immediate, 24/7 Priority</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    )
}