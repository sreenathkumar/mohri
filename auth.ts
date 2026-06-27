import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@lib/db"
import { signInSchema } from "@lib/zod"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import { verifyUser } from "./actions/auth/verifyPassword"
import { authConfig } from "./auth.config"


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
            if (trigger === 'update') {
                return { ...token, ...session.user }
            }
            if (user) {
                token.emailVerified = user.emailVerified || null;
                token.role = user.role;
                token.image = user.image;
                token.id = user.id;
            }
            return token
        },
        async session({ session, token }) {
            session.user.emailVerified = (token as { emailVerified?: Date | null }).emailVerified || null;
            session.user.role = (token as { role?: string }).role || "user";
            session.user.image = (token as { image?: string }).image || '';
            session.user.id = (token as { id?: string }).id || '';
            return session
        }
    }

})