export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Header Section */}
            <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: July 2026</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8 text-foreground">
                        {/* Introduction */}
                        <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                At OpsCommerce, we build tools to help local e-commerce merchants coordinate their delivery logistics. We believe in complete transparency. This Privacy Policy explains exactly how we collect, use, and protect your data, your drivers&#39; data, and your customers&#39; delivery information.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                We do not sell your data, we do not run tracking ads, and we collect only the minimum information necessary to run your delivery operations smoothly.
                            </p>
                        </div>

                        {/* Section 1: Information We Collect */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">1. Information We Collect</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                To sync your orders and coordinate dispatch routes, we collect three categories of information:
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">A. Merchant Account Data</h3>
                                    <p className="text-muted-foreground">
                                        Your name, email address, and business details you provide when registering for an account. We also securely encrypt and store API keys, access tokens, and store URLs for your connected Shopify and WooCommerce platforms.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">B. Store & Order Data (Your Customers)</h3>
                                    <p className="text-muted-foreground">
                                        Customer names, delivery addresses, phone numbers, and order items. We only retrieve this data for orders that require local delivery or route dispatching. We do <strong className="text-foreground">not</strong> collect or store credit card numbers or payment processing credentials.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">C. Driver Data</h3>
                                    <p className="text-muted-foreground">
                                        Names, emails, and credentials created by your delivery drivers to accept invitations and access their dispatch queues, alongside active delivery status logs and cash collection receipts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: How We Use Your Information */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">2. How We Use Your Information</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                We use the collected information strictly to power the core utility of the OpsCommerce platform:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>To fetch and centralize orders from your connected Shopify and WooCommerce stores.</li>
                                <li>To generate secure dispatch queues and active route lists for your onboarded delivery drivers.</li>
                                <li>To calculate basic delivery routes and track active fulfillment statuses.</li>
                                <li>To log cash-on-delivery (COD) collections managed by your driver fleet.</li>
                                <li>To provide you with direct, high-priority developer support.</li>
                            </ul>
                        </div>

                        {/* Section 3: Data Sharing and Third Parties */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">3. Data Sharing and Third Parties</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                We will never sell or rent your business, customer, or driver data. We only share information with third-party services that are absolutely required to operate the application:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>
                                    <span className="font-medium text-foreground">Cloud Infrastructure:</span> Your database and application records are securely stored with our primary hosting and database providers.
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">Platform Integrations:</span> Data is read from and written back to your connected Shopify and WooCommerce stores via their official developer APIs.
                                </li>
                            </ul>
                        </div>

                        {/* Section 4: Data Security & Retention */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">4. Data Security & Retention</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We take security seriously and utilize standard industry practices to keep your connections secure. All data transferred between your browser, our servers, and your store integrations is encrypted using SSL/TLS. We encrypt stored API access tokens and only retain customer delivery address metadata on our servers for as long as your account remains active or as required to maintain historical logs on your dashboard.
                            </p>
                        </div>

                        {/* Section 5: Your Rights and Data Control */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">5. Your Rights and Data Control</h2>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                As a merchant, you have complete control over your data:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>You can disconnect your Shopify or WooCommerce store integrations at any time, which immediately revokes our API access tokens.</li>
                                <li>You can request the complete deletion of your OpsCommerce merchant account, driver accounts, and historical order sync logs at any time.</li>
                                <li>You can remove driver profiles or edit dispatch routes directly from your main dashboard settings.</li>
                            </ul>
                        </div>

                        {/* Section 6: Changes to This Privacy Policy */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-foreground">6. Changes to This Privacy Policy</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this policy occasionally as we add new features (such as SMS notifications or live map integrations). If we make significant changes to how we handle sensitive information, we will notify you directly via email before those changes take effect.
                            </p>
                        </div>

                        {/* Footer Support Info */}
                        <div className="bg-white/[0.05] border border-white/[0.1] rounded-lg p-6">
                            <p className="text-muted-foreground text-sm">
                                If you have questions, security concerns, or data deletion requests regarding this Privacy Policy, please reach out directly to the developer at{" "}
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
    );
}