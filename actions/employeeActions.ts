"use server";

import { auth } from "@/lib/auth";
import { getRequiredSessionContext } from "@/lib/auth-context";
import {
    checkEmployeeExists,
    fetchDrivers,
    fetchEmployees
} from "@/services/employeeService";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

// Allowed email domains
const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com"];

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .refine(
            (email) => {
                const domain = email.split("@")[1];
                return ALLOWED_EMAIL_DOMAINS.includes(domain?.toLowerCase());
            },
            { message: "Only Gmail, Yahoo, and Outlook emails are allowed." }
        ),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    role: z.string().min(1, { message: "Role is required" }),
});

/**
 * Action: Get all employees for active organization
 * @returns Array of employees or empty array on error
 */
export async function getAllEmployees() {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner']
        })
        return await fetchEmployees({ organizationId });
    } catch (error: any) {
        console.error("[getAllEmployees] Error fetching employees:", error?.message);
        return [];
    }
}

/**
 * Action: Fetch all drivers for assigned orders
 */
export async function getAllDrivers() {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager']
        });

        return await fetchDrivers({ organizationId });
    } catch (error: any) {
        console.error("[getAllDrivers] Error fetching drivers:", error?.message);
        return [];
    }
}

/**
 * Check if an email is already associated with an account or employee
 * @param email - The email address to check
 * @returns boolean - true if the email exists, false otherwise
 */
export async function checkEmployeeEmail(email: string) {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager']
        });

        const employee = await checkEmployeeExists({ email, organizationId });

        if (employee) {
            return true
        } else {
            return false
        }
    } catch (error: any) {
        console.error("[checkEmployeeEmail] Error:", error?.message);
        return false
    }
}

/**
 * Direct registration & add employee to organization
 * @param prevState - Previous state (not used in this function)
 * @param data - FormData containing employee details
 * @returns Object with status and message indicating success or failure
 */
export async function addEmployee(prevState: unknown, data: FormData) {
    try {
        const { role, organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        if (role === 'manager' && data.get("role") === 'owner' || 'manager') {
            throw new Error("Unauthorized: You're not allowed to set this role.");
        }

        const validated = formSchema.safeParse(data);

        if (!validated.success) {
            return {
                status: "error",
                message: "Invalid form data. Please check your inputs.",
                errors: validated.error.flatten().fieldErrors,
            };
        }

        //register the employee
        const registerResult = await auth.api.signUpEmail({
            body: {
                email: validated.data.email,
                password: validated.data.password,
                name: validated.data.name,
            }
        })

        if (!registerResult.token || !registerResult.user) {
            throw new Error("Failed to register employee. Please try again.");
        }

        //add the member to the organization
        const memberResult = await auth.api.addMember({
            body: {
                userId: registerResult.user.id,
                organizationId,
                role: validated.data.role as "owner" | "manager" | "driver",
            }
        });

        if (!memberResult.userId) {
            throw new Error("Failed to add employee to organization. Please try again.");
        }

        return {
            success: true,
            message: "Employee added successfully. Please verify their email address to complete the registration.",
        }

    } catch (error: any) {
        console.error("[addEmployee] Error:", error?.message);
        return { status: "error", message: error?.message || "An error occurred while adding employee." };
    }
}

// /**
//  * Action: Send invitation link to employee
//  */
// export async function inviteEmployee(prevState: unknown, data: FormData) {
//     try {
//         const { role, organizationId, userId } = await getServerSessionContext();

//         if (role !== "merchant" && role !== "owner" && role !== "admin") {
//             return { status: "error", message: "Unauthorized: Only merchants can invite employees." };
//         }

//         const email = data.get("email") as string;
//         const staffRole = data.get("role") as string;

//         if (!email || !staffRole) {
//             return { status: "error", message: "Email and role are required." };
//         }

//         const token = crypto.randomBytes(32).toString("hex");

//         await createTeamInviteService({
//             email,
//             role: staffRole,
//             token,
//             organizationId,
//             invitedBy: userId,
//         });

//         const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/invite?token=${token}`;

//         return {
//             status: "success",
//             link: inviteUrl,
//             message: "Employee invited successfully. Please share the invitation link.",
//         };
//     } catch (error: any) {
//         console.error("[inviteEmployee] Error:", error?.message);
//         return { status: "error", message: error?.message || "An error occurred while inviting employee." };
//     }
// }

/**
 * Change the role of an existing employee in the organization
 * @param id - The ID of the employee whose role is to be changed
 * @param newRole - The new role to assign to the employee
 * @returns Object with status and message indicating success or failure
 */
export async function updateEmployeeRole({ id, newRole }: { id: string, newRole: string }) {
    try {
        const { role, organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        })

        if (role === 'manager' && (newRole === 'owner' || newRole === 'manager')) {
            throw new Error("Unauthorized: You're not allowed to set this role.");
        }

        const result = await auth.api.updateMemberRole({
            body: {
                role: [newRole],
                organizationId,
                memberId: id
            },
            headers: await headers()
        })

        if (Object.keys(result).length === 0) {
            throw new Error("Failed to update employee role. Please try again.");
        }
        revalidatePath("/employees");

        return {
            status: "success",
            message: "Employee role updated successfully.",
        };
    } catch (error: any) {
        console.error("[updateEmployee] Error:", error?.message);
        return {
            status: "error",
            message: error?.message || "An error occurred while updating employee.",
        };
    }
}

