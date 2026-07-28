import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@lib/db"
import { signInSchema } from "@lib/zod"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import { verifyUser } from "./actions/auth/verifyPassword"
import { authConfig } from "./auth.config"
import dbConnect from "./dbConnect"
import Shop from "./models/shopModel"
import Membership from "./models/membershipModel"


export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: MongoDBAdapter(client),
    providers: [
        GoogleProvider,
        FacebookProvider,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                try {
                    let user = null

                    const { email, password } = await signInSchema.parseAsync(credentials)

                    // logic to verify if the user exists
                    user = await verifyUser({ email, password });

                    if (!user) {
                        throw new Error('Invalid credentials')
                    }

                    // return JSON object with the user data
                    return user
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        throw new Error(error.message || 'Unknown error')
                    } else {
                        throw new Error('Unknown error')
                    }
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === 'update' && session?.user?.emailVerified) {
                token.emailVerified = new Date(session.user.emailVerified);

                return token
            }
            if (user) {
                token.emailVerified = user.emailVerified || null;
                token.image = user.image;
                token.id = user.id;

                await dbConnect(); // Ensure the database connection is established

                // Check if the user is a Merchant (Owner)
                // If they own at least one shop, their userId IS the merchantId workspace context.
                const ownedShop = await Shop.findOne({ ownerId: user.id }).lean().catch(() => null)

                if (ownedShop) {
                    token.role = 'merchant';
                }

                // Check if the user is a Staff member (Clerk / Driver)
                const membership = await Membership.findOne({ user: user.id }).lean().catch(() => null) as { userId: string, role: 'merchant' | 'clerk' | 'driver', merchantId: string } | null;

                if (membership) {
                    token.role = membership.role;
                }
            }
            return token
        },
        async session({ session, token }) {
            const rawVerified = token.emailVerified;
            session.user.emailVerified = rawVerified ? new Date(rawVerified as string | Date) : null;
            session.user.image = (token as { image?: string }).image || '';
            session.user.id = (token as { id?: string }).id || '';
            session.user.role = (token as { role?: 'merchant' | 'clerk' | 'driver' }).role || 'merchant';
            return session
        }
    }

})