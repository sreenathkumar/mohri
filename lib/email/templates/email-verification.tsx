import * as React from "react";
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
    Img
} from "react-email";


interface VerifyEmailTemplateProps {
    name?: string;
    verificationLink: string;
}

function VerifyEmailTemplate({
    name = "there",
    verificationLink = "#",
}: VerifyEmailTemplateProps) {

    return (
        <Html lang="en">
            <Tailwind>
                <Head />
                <Preview>Verify your email address for OpsCommerce</Preview>

                <Body className="bg-slate-50 font-sans py-10">
                    <Container className="bg-white mx-auto my-0 p-8 rounded-xl border border-slate-200 max-w-lg shadow-sm">
                        {/* Brand Logo / Header */}
                        <Section className="mb-6">
                            <Img src='https://opscommerce.app/email-logo.png' alt="logo" width="240" height='48' />
                        </Section>

                        <Hr className="border-slate-100 my-6" />

                        {/* Main Message */}
                        <Section className="mb-6">
                            <Text className="text-2xl font-bold text-slate-900 mb-2">
                                Verify your email address
                            </Text>
                            <Text className="text-slate-600 text-base leading-relaxed mb-4">
                                Hi {name},
                            </Text>
                            <Text className="text-slate-600 text-base leading-relaxed mb-6">
                                Thanks for signing up for OpsCommerce! Please confirm your email address by clicking the button below to activate your account.
                            </Text>

                            {/* Confirmation CTA Button */}
                            <Section className="text-center my-8">
                                <Button
                                    href={verificationLink}
                                    style={{
                                        backgroundColor: '#ea580c',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        display: 'inline-block',
                                        lineHeight: '100%',
                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                    }}
                                >
                                    Confirm Email Address
                                </Button>
                            </Section>

                            {/* Expiration Note & Fallback Link */}
                            <Text className="text-slate-500 text-xs leading-normal mb-2">
                                This verification link will expire in 24 hours.
                            </Text>
                            <Text className="text-slate-500 text-xs leading-normal">
                                If the button above doesn't work, copy and paste this link into your browser:{" "}
                                <Link href={verificationLink} className="text-blue-600 underline break-all">
                                    {verificationLink}
                                </Link>
                            </Text>
                        </Section>

                        <Hr className="border-slate-100 my-6" />

                        {/* Security Notice & Footer */}
                        <Section>
                            <Text className="text-slate-400 text-xs m-0 leading-relaxed">
                                If you didn't create an account with OpsCommerce, you can safely ignore this email.
                            </Text>
                            <Text className="text-slate-400 text-xs mt-2 m-0">
                                © {new Date().getFullYear()} OpsCommerce. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

export default VerifyEmailTemplate;