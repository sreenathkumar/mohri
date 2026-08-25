import { sendOrganizationInvitation, sendResetPasswordEmail, sendVerificationEmail } from "@/services/emailService";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { ac, driver, manager, owner, } from "./permissions";
import prisma from "./prisma";
import { redirect } from "next/navigation";


export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "mongodb" }),
    advanced: { database: { generateId: false } },
    plugins: [
        organization({
            ac: ac,
            roles: {
                owner,
                manager,
                driver,
            },
            schema: {
                organization: {
                    additionalFields: {
                        timezone: {
                            type: "string",
                            required: false,
                            defaultValue: 'UTC',
                            input: true,
                            returned: true,
                        }
                    },
                }
            },
            requireEmailVerificationOnInvitation: true,
            async sendInvitationEmail(data) {
                const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding?invitationId=${data.id}`;
                sendOrganizationInvitation({
                    to: data.email,
                    invitationLink: inviteUrl,
                    name: 'there',
                    inviterName: data.inviter.user.name || 'your colleague',
                    organizationName: data.organization.name || 'your organization',
                    role: data.role || 'driver'
                })
            },
            organizationHooks: {
                afterRemoveMember: async ({ user }) => {
                    const ctx = await auth.$context;
                    await ctx.internalAdapter.deleteUserSessions(user.id);
                    console.log(`User ${user.email} has been removed from the organization and their sessions have been deleted.`);
                }
            }
        }),
    ],
    session: {
        additionalFields: {
            activeOrganizationId: { type: "string", default: null, },
            activeOrganizationSlug: { type: "string", default: null, },
            role: {
                type: "string",
                default: 'owner',
                input: false,

            },
        },
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
            strategy: 'compact'
        }
    },
    databaseHooks: {
        session: {
            create: {
                //set the role and organizationId in the session when logged in/session is created
                before: async (session) => {
                    const membership = await prisma.member.findFirst({
                        where: {
                            userId: session.userId,
                        },
                        include: {
                            organization: true
                        }
                    });

                    return {
                        data: {
                            ...session,
                            role: membership?.role,
                            activeOrganizationId: membership?.organizationId ? membership.organizationId.toString() : null,
                            activeOrganizationSlug: membership?.organization?.slug || null,
                        },
                    };
                },
            },
            update: {
                before: async (sessionData, ctx) => {
                    // Check if activeOrganizationId is being changed
                    if (sessionData.activeOrganizationId !== undefined) {
                        if (sessionData.activeOrganizationId === null) {
                            return { data: sessionData };
                        }

                        // Fetch the organization's slug
                        const userId = sessionData.userId || ctx?.context?.session?.session?.userId;

                        if (!userId) {
                            return { data: sessionData };
                        }
                        const member = await prisma.member.findFirst({
                            where: {
                                userId
                            },
                            include: {
                                organization: true,
                            },
                        });

                        if (member && member.organization) {
                            return {
                                data: {
                                    ...sessionData,
                                    activeOrganizationSlug: member.organization.slug,
                                    role: member.role,
                                },
                            };
                        }
                    }
                    return { data: sessionData };
                },
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
            void sendResetPasswordEmail({
                to: user.email,
                resetLink: url,
                userName: user.name || 'there'
            });
        },
        onPasswordReset: async ({ user }, request) => {
            redirect('/continue');
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const customUrl = new URL(url);
            customUrl.searchParams.set("callbackURL", "/email-verified");

            void sendVerificationEmail({
                to: user.email,
                verificationLink: customUrl.toString(),
                userName: user.name || 'there'
            });
        },
        sendOnSignUp: true,
        expiresIn: 60 * 24,
        autoSignInAfterVerification: true,
    }
});

export type Role = 'owner' | 'manager' | 'driver';