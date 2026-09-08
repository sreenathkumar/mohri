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
    url: string;
}

function ResetPasswordEmail({ name, url }: VerifyEmailTemplateProps) {
    return (
        <Html lang="en">
            <Tailwind>
                <Head />
                <Preview>Reset your password for OpsCommerce</Preview>

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
                                Reset your password
                            </Text>
                            <Text className="text-slate-600 text-base leading-relaxed mb-4">
                                Hi {name || 'there'},
                            </Text>
                            <Text className="text-slate-600 text-base leading-relaxed mb-6">
                                We received a request to reset your password for your OpsCommerce account. Click the button below to reset it.
                            </Text>

                            {/* Confirmation CTA Button */}
                            <Section className="text-center my-8">
                                <Button
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
                                    href={url}
                                >
                                    Reset Password
                                </Button>
                            </Section>

                            <Text className="text-slate-600 text-base leading-relaxed mb-4">
                                If you did not request a password reset, please ignore this email or <Link href="https://opscommerce.app/help">contact support</Link> if you have questions.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default ResetPasswordEmail;