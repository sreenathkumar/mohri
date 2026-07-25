import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.DB_URI || "",);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    user: { modelName: "users" },
    plugins: [
        organization(),
    ],
    session: {
        additionalFields: {
            activeOrganizationId: { type: "string", required: false },
            role: { type: "string", required: false },
        },
    },
    databaseHooks: {
        session: {
            create: {
                //set the role and organizationId in the session when logged in/session is created
                before: async (session) => {
                    const membership = await db.collection("member").findOne({
                        userId: new ObjectId(session.userId),
                    });

                    return {
                        data: {
                            ...session,
                            role: membership ? membership.role : null,
                            activeOrganizationId: membership?.organizationId ? membership.organizationId.toString() : null,
                        },
                    };
                },
            },
        },
    },
    emailAndPassword: { enabled: true, },
});

