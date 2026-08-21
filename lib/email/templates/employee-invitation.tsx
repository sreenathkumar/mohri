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

interface InvitationTemplateProps {
    name?: string;
    invitationLink: string;
    organizationName: string;
    inviterName: string;
    role?: string;
}

function EmployeeInvitation({
    name = "there",
    invitationLink = "#",
    organizationName = "your organization",
    inviterName = "your colleague",
    role,
}: InvitationTemplateProps) {
    return (
        <Html lang="en">
            <Tailwind>
                <Head />
                <Preview>You've been invited to join the team</Preview>

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
                                You've been invited to join the {organizationName} team
                            </Text>
                            <Text className="text-slate-600 text-base leading-relaxed mb-4">
                                Hi {name},
                            </Text>
                            <Text className="text-slate-600 text-base leading-relaxed mb-6">
                                <strong>{inviterName}</strong> has invited you to join the
                                <strong>{organizationName}</strong> digital workspace as a {role}. Click the button below to accept the invitation and set up your account.
                            </Text>

                            {/* Confirmation CTA Button */}
                            <Section className="text-center my-8">
                                <Button
                                    href={invitationLink}
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
                                    Accept Invitation
                                </Button>
                            </Section>

                            {/* Expiration Note & Fallback Link */}
                            <Text className="text-slate-500 text-xs leading-normal mb-2">
                                This verification link will expire in 2 days.
                            </Text>
                            <Text className="text-slate-500 text-xs leading-normal">
                                If the button above doesn't work, copy and paste this link into your browser:{" "}
                                <Link href={invitationLink} className="text-blue-600 underline break-all">
                                    {invitationLink}
                                </Link>
                            </Text>
                        </Section>

                        <Hr className="border-slate-100 my-6" />

                        {/* Security Notice & Footer */}
                        <Section>
                            <Text className="text-slate-400 text-xs m-0 leading-relaxed">
                                If you think the email is reached to you unintentionally or you don't recognize the sender, then ignore it.
                            </Text>
                            <Text className="text-slate-400 text-xs mt-2 m-0">
                                © {new Date().getFullYear()} OpsCommerce. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default EmployeeInvitation