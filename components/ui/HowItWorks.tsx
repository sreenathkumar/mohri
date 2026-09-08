import { CheckCircle2 } from 'lucide-react'

const steps = [
    {
        number: '01',
        title: 'Connect Your Stores',
        description: 'Link your Shopify and WooCommerce stores with just a few clicks. No technical knowledge required.',
    },
    {
        number: '02',
        title: 'Set Up Your Team',
        description: 'Add delivery personnel and assign roles. Manage permissions and track accountability.',
    },
    {
        number: '03',
        title: 'Manage Operations',
        description: 'View all orders, assign deliveries, and track progress from a central dashboard.',
    },
    {
        number: '04',
        title: 'Reconcile Payments',
        description: 'Verify cash collections from drivers and generate settlement reports in seconds.',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        Get Started in Minutes
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Onboarding is simple. Start managing your operations efficiently today.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-white sticky top-8">
                                        {step.number}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="w-0.5 h-24 bg-gradient-to-b from-primary/60 to-primary/10 my-4"></div>
                                    )}
                                </div>

                                <div className="pb-8">
                                    <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                                    <div className="flex items-center gap-2 text-primary">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">Get instant access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
