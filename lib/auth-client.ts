import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, inferOrgAdditionalFields, organizationClient } from "better-auth/client/plugins"
import type { auth } from "./auth"


export const authClient = createAuthClient({
    plugins: [
        organizationClient({ schema: inferOrgAdditionalFields<typeof auth>(), }),
        inferAdditionalFields<typeof auth>(),
    ],
});

export const { useSession, signIn, signOut, signUp, organization } = authClient;