import { ArrowUpRight } from 'lucide-react'

const benefits = [
    {
        metric: '75%',
        label: 'Time Saved',
        description: 'On multi-store order sync and driver dispatching',
    },
    {
        metric: '99%',
        label: 'Accuracy',
        description: 'In cash collect logs and delivery tracking updates',
    },
    {
        metric: '3x',
        label: 'Faster Delivery',
        description: 'Through optimized route planning and team coordination',
    },
    {
        metric: '$10K',
        label: 'Annual Savings',
        description: 'Per merchant on average operations costs',
    },
]

export default function BenefitsSection() {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-50 -translate-y-1/2"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        Impact by the Numbers
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        See how OpsCommerce transforms ecommerce operations.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-secondary border border-border p-8 hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="relative z-10">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                                        {benefit.metric}
                                    </span>
                                    <ArrowUpRight className="w-5 h-5 text-primary" />
                                </div>

                                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.label}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                            </div>

                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
