'use client'

export default function IntegrationShowcase() {
    return (
        <section id="integrations" className="relative py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                        Native Integrations
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Seamlessly connect with the platforms your business already uses.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">🛍️</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-1">Shopify</h3>
                                <p className="text-muted-foreground">Real-time order sync from all your Shopify stores and sales channels.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">🌐</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-1">WooCommerce</h3>
                                <p className="text-muted-foreground">Full integration with WooCommerce stores and custom API endpoints.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">💰</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground mb-1">Custom Webhooks</h3>
                                <p className="text-muted-foreground">Real-time data payloads pushed to your external systems instantly.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl blur-2xl opacity-50"></div>
                        <div className="relative bg-gradient-to-br from-card to-secondary rounded-2xl border border-border p-8 md:p-12">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { name: 'Shopify', icon: '🛍️' },
                                    { name: 'WooCommerce', icon: '🌐' },
                                    { name: 'Webhooks/APIs', icon: '📊' },
                                    { name: 'SMS/Messaging', icon: '📧' },
                                    { name: 'Accounting', icon: '📑' },
                                ].map((integration, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-lg border border-border/50 bg-background/50 hover:border-primary/50 transition-colors">
                                        <span className="text-3xl">{integration.icon}</span>
                                        <span className="text-sm font-medium text-muted-foreground text-center">{integration.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
