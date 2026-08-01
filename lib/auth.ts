import { sendVerificationEmail } from "@/services/emailService";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
import { headers } from "next/headers";
import { cache } from "react";
import { ac, driver, manager, owner, } from "./permissions";
import prisma from "./prisma";


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
            }
        }),
    ],
    session: {
        additionalFields: {
            activeOrganizationId: { type: "string", default: null, },
            role: {
                type: "string",
                default: 'owner',
                input: false
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
                    });
                    return {
                        data: {
                            ...session,
                            role: membership?.role || 'owner',
                            activeOrganizationId: membership?.organizationId ? membership.organizationId.toString() : null,
                        },
                    };
                },
            },
        },
    },
    emailAndPassword: { enabled: true, },
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
        expiresIn: 60,
        autoSignInAfterVerification: true,
    }
});

export type Role = 'owner' | 'manager' | 'driver';