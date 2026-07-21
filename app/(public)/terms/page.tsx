export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: July 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8 text-foreground">

                        {/* 1. Acceptance of Terms */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing and using OpsCommerce (&quot;the Service&quot;), you accept and agree to be bound by these terms. If you do not agree to these terms, please do not use or access our service.
                            </p>
                        </div>

                        {/* 2. Right to Use and Service Scope */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">2. Description of Service &amp; Usage License</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                OpsCommerce is a software platform designed to help e-commerce merchants aggregate orders from connected Shopify and WooCommerce stores, dispatch shipments, and track local deliveries. Under this agreement, we grant you a commercial, non-exclusive, non-transferable right to access and use the Service for your legitimate business operations. You agree not to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Attempt to decompile, reverse engineer, or extract the source code of the Service.</li>
                                <li>Use the Service to transmit malicious code, malware, or spam.</li>
                                <li>Bypass platform resource limits or API usage controls.</li>
                                <li>Resell or redistribute access to the platform as a standalone service.</li>
                            </ul>
                        </div>

                        {/* 3. Subscriptions, Billing &amp; Cancellations */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">3. Subscriptions, Billing &amp; Cancellations</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                We offer tiered subscription plans designed to match your operational scale:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li><strong className="text-foreground">Billing:</strong> Subscriptions are billed on a recurring monthly basis. You are responsible for providing valid payment information.</li>
                                <li><strong className="text-foreground">Cancellations:</strong> You can cancel your subscription at any time directly through your account settings. Upon cancellation, your access remains active until the end of your current billing cycle.</li>
                                <li><strong className="text-foreground">Refunds:</strong> We operate a clear, transparent refund policy. If you are unsatisfied, please contact us within 14 days of your initial payment for a full refund.</li>
                            </ul>
                        </div>

                        {/* 4. Connected Stores and Third-Party API Rates */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">4. Platform Connections &amp; Integration Responsibility</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                OpsCommerce syncs with third-party platforms (including Shopify and WooCommerce) via official APIs. You are solely responsible for maintaining active, secure, and compliant store configurations. We are not liable for any operational downtime, API rate limit restrictions, or service interruptions caused directly by the third-party platforms you connect.
                            </p>
                        </div>

                        {/* 5. Onboarding and Driver Accounts */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">5. Driver Onboarding and Security</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You are fully responsible for the activities of any delivery drivers or staff members you invite onto your workspace dashboard. Drivers must keep their login credentials confidential. OpsCommerce is not responsible for any security breaches resulting from compromised driver credentials or unauthorized actions taken using your specific active workspace invite links.
                            </p>
                        </div>

                        {/* 6. Disclaimers */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">6. Disclaimer of Warranties</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                OpsCommerce is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no express or implied warranties regarding the constant, uninterrupted uptime of the sync engine or dispatch tracking routes. While we actively prioritize technical stability, you acknowledge that delivery tracking calculations are subject to external cellular networks, driver mobile browser settings, and GPS signal reliability.
                            </p>
                        </div>

                        {/* 7. Limitations of Liability */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">7. Limitations of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall OpsCommerce, its developer, or its suppliers be liable for any indirect, incidental, or consequential damages (including, without limitation, damages for loss of business profits, delivery delays, missing cash-on-delivery logs, or business interruptions) arising out of the use or inability to use the platform.
                            </p>
                        </div>

                        {/* 8. Modifications to Terms */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">8. Modifications to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to revise these terms at any time as our feature set expands. Any major changes will be announced directly to our active merchants via email before taking effect. Continued use of the Service following these updates indicates your active agreement to the revised terms.
                            </p>
                        </div>

                        {/* 9. Account Termination */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">9. Account Termination</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to temporarily suspend or permanently terminate accounts that violate these terms, engage in abusive support behavior, or fail to settle outstanding subscription balances. Upon voluntary termination of your account, all connected store keys and platform data will be queued for permanent deletion.
                            </p>
                        </div>

                        {/* Support Block */}
                        <div className="bg-white/[0.05] border border-white/[0.1] rounded-lg p-6">
                            <p className="text-muted-foreground text-sm">
                                If you have any questions about these Terms of Service, please reach out directly to the developer at{" "}
                                <a href="mailto:support@opscommerce.com" className="text-primary hover:underline font-medium">
                                    support@opscommerce.com
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}