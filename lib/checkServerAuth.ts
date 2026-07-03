import { auth } from "@/auth";
import dbConnect from "@/dbConnect";
import Membership from "@/models/membershipModel";
import Shop from "@/models/shopModel";

export interface ServerUserSession {
    userId: string;
    role: 'merchant' | 'clerk' | 'driver';
    merchantId: string;
}

interface MembershipData {
    userId: string;
    merchant: string;
    role: 'clerk' | 'driver';
}

interface ShopData {
    ownerId: string;
    name: string;
    platform: 'woocommerce' | 'shopify';
    domain: string;
}


/**
 * ### 🛡️ Runtime Security & Workspace Context Gatekeeper
 * * **OVERVIEW:**
 * This utility acts as the primary firewall and workspace resolver for Server Actions. 
 * It handles connection initialization, identity verification, and permission mapping in a single call.
*
* * ⚠️ **DATABASE MANAGEMENT:**
 * **`dbConnect()` is automatically executed inside this utility.** You do *not* need to call 
 * `dbConnect()` again in the Server Action that consumes this function.
*
* * **EXECUTION FLOW:**
 * 1. Establishes a cached connection to MongoDB via `dbConnect()`.
 * 2. Fetches the active web session token via Auth.js `auth()`.
 * 3. Evaluates if the identity is a root system `merchant` (owns a storefront).
 * 4. Checks the `Membership` collection if the identity is an in-house `clerk` or `driver`.
 * * @returns {Promise<SessionUserContext>} Object containing decrypted `userId`, resolved workspace `role`, and the corporate `merchantId`.
 * * @throws {Error} **Unauthorized (401)** - If no valid session is found or the user token has expired.
 * @throws {Error} **Internal Server Error (500)** - If MongoDB connection fails or an underlying query times out.
 * * @example
 * ```typescript
 * "use server";
 * * export const myAction = async () => {
 * // Connects DB, verifies auth, and exposes roles automatically:
 * try{
 * * const { role, merchantId } = await requireSessionContext();
 * * // Proceed with business logic safely...
 * };
 * ```
 */

export const getServerSessionContext = async (): Promise<ServerUserSession> => {
    try {
        const session = await auth();

        //Check if the user is logged in
        if (!session || !session.user || !session.user.id) {
            throw new Error("User is not authenticated or session is invalid.");
        }

        const userId = session.user.id;

        await dbConnect(); // Ensure the database connection is established

        // Check if the user is a Merchant (Owner)
        // If they own at least one shop, their userId IS the merchantId workspace context.
        const ownedShop = await Shop.findOne({ ownerId: userId }).lean().catch(() => null) as ShopData | null;

        if (ownedShop) {
            return {
                userId,
                role: 'merchant',
                merchantId: userId // For merchants, they are the root owner
            };
        }

        // Check if the user is a Staff member (Clerk / Driver)
        const membership = await Membership.findOne({ user: userId }).lean().catch(() => null) as MembershipData | null;

        if (membership) {
            return {
                userId,
                role: membership.role, // 'clerk' or 'driver'
                merchantId: membership.merchant.toString() // The business context they work under
            };
        }

        // Fallback: User is logged in but has no shop and no staff membership yet
        // A brand new merchant who just registered but hasn't created a store)
        return {
            userId,
            role: 'merchant',
            merchantId: userId
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // Log the exact internal error securely in your server terminal for debugging
        console.log("CRITICAL ERROR in requireSessionContext utility:", error.message);
        throw error;
    }
};