import { Button } from '@/components/shadcn/button'
import { ArrowRight, Check } from 'lucide-react'

export default function CTASection() {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>

            <div className="relative max-w-4xl mx-auto">
                <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-background p-12 md:p-16 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                        Ready to Transform Your Operations?
                    </h2>

                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        Take control of your multi-store logistics. Start streamlining your delivery operations and driver workflows today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-base px-8 py-6 md:px-10">
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-base px-8 py-6">
                            Schedule Demo
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        {[
                            'No credit card required',
                            'Full access to all features',
                            'Cancel anytimes',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center justify-center gap-3">
                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <span className="text-muted-foreground">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
