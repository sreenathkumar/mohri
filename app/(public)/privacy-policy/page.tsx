const appName = "Order Management"
const companyName = 'Sreenath Kumar'
const appUrl = 'sreenathkumar.vercel.app'
const lastUpdated = '13-10-2025'

async function PrivacyPage() {
    return (
        <main className="flex-1 flex items-center justify-center gap-4">
            <div className="container max-w-(--breakpoint-xl) px-4 py-16 md:py-24 md:px-8">
                <div>
                    <h1 className="text-3xl font-bold">{appName} — Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Last updated: <span className="font-medium">{lastUpdated}</span>
                    </p>
                </div>

                <section className="prose prose-sm max-w-none mt-10">
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        <strong>{appName}</strong> we provide a
                        software-as-a-service (SaaS) platform that allows Shopify
                        merchants to manage, fulfill, and deliver orders from multiple
                        stores. This policy describes how we collect, use, store, and
                        protect information obtained through our app in accordance with
                        Shopify’s API data protection requirements and applicable data
                        protection laws.
                    </p>

                    <h2 className="text-2xl font-bold mt-10">Data We Collect</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        Through our integration with the Shopify API, we may access and
                        process the following information from a merchant’s store:
                    </p>
                    <ul className='list-disc list-inside text-base/7 text-muted-foreground ml-4 mt-4'>
                        <li>
                            <strong>Order details:</strong> order ID, line items,
                            fulfillment status, shipping address, delivery notes.
                        </li>
                        <li>
                            <strong>Customer information:</strong> name, email address,
                            phone number, delivery address.
                        </li>
                        <li>
                            <strong>Store information:</strong> shop name, shop domain,
                            location, and contact information.
                        </li>
                    </ul>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        We only request the minimum data necessary to perform the
                        services described below.
                    </p>

                    <h2 className="text-2xl font-bold mt-10">Purpose of Data Use</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>We use data solely to provide our order management services:</p>
                    <ul className='list-disc list-inside text-base/7 text-muted-foreground ml-4 mt-4'>
                        <li>Aggregating orders across multiple stores for fulfillment.</li>
                        <li>
                            Coordinating delivery, tracking, and merchant/customer
                            communication.
                        </li>
                        <li>Providing analytics and reporting to merchants.</li>
                    </ul>
                    <p className='text-base/7 text-muted-foreground mt-6'>We do not sell or rent customer personal information.</p>

                    <h2 className="text-2xl font-bold mt-10">Data Retention and Deletion</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        We retain personal information only as long as necessary to
                        provide our services or as required by law.
                    </p>
                    <ul className='list-disc list-inside text-base/7 text-muted-foreground ml-4 mt-4'>
                        <li>
                            <strong>Automatic deletion:</strong> When a merchant uninstalls
                            our app, we automatically delete all associated customer and
                            order data within <strong>48 hours</strong>.
                        </li>
                        <li>
                            <strong>On-request deletion:</strong> Merchants can request
                            data deletion anytime by contacting{" "}
                            <a className='underline' href='sreenathkumar.vercel.app/contact'>here</a>.
                        </li>
                        <li>
                            <strong>Backups:</strong> Backups are encrypted and purged
                            within <strong>30 days</strong> of deletion.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-10">Data Security</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>We implement technical and organizational safeguards:</p>
                    <ul className='list-disc list-inside text-base/7 text-muted-foreground ml-4 mt-4'>
                        <li>Least-privilege access for staff and MFA for admin access.</li>
                        <li>Separation of production and test environments.</li>
                        <li>Continuous monitoring and access logging.</li>
                        <li>Regular security reviews and incident response procedures.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-10">Data Sharing</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        We may share limited data with trusted service providers (hosting,
                        infrastructure, analytics). All providers are bound by Data
                        Processing Agreements requiring adequate protections (e.g.,
                        GDPR/CCPA compliance).
                    </p>

                    <h2 className="text-2xl font-bold mt-10">Merchant & Customer Rights</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        Merchants and their customers can request access, correction, or
                        deletion of personal data. Requests should be sent to {" "}
                        <a className='underline' target="_blank" href='https://sreenathkumar.vercel.app/contact' >the email</a>. We will
                        respond within <strong>30 days</strong>.
                    </p>

                    <h2 className="text-2xl font-bold mt-10">Compliance with Shopify API Requirements</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        We comply with Shopify’s Protected Customer Data access rules and
                        meet Level 1 and Level 2 expectations, including data
                        minimization, encryption, deletion on uninstall, access logging,
                        and incident response.
                    </p>

                    <h2 className="text-2xl font-bold mt-10">International Data Transfers</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        When transferring data internationally, we rely on appropriate
                        safeguards (e.g., Standard Contractual Clauses) to protect data.
                    </p>

                    <h2 className="text-2xl font-bold mt-10">Changes to This Policy</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        Material changes will be posted on our website ({appUrl}) and the
                        “Last updated” date will be changed.
                    </p>

                    <h2 className="text-2xl font-bold mt-10">Contact</h2>
                    <p className='text-base/7 text-muted-foreground mt-6'>
                        <strong>{companyName}</strong>
                        <br />
                        Email: <a className='underline' rel="noopener noreferrer" href='sreenathkumar.vercel.app'>Reach out here</a>
                        <br />
                        Website: <a href={appUrl}>{appUrl}</a>
                    </p>
                </section>
            </div>
        </main>
    )
}

export default PrivacyPage