"use server";

import { auth } from "@/lib/auth";
import { getRequiredSessionContext } from "@/lib/auth-context";
import {
    checkEmployeeExists,
    fetchDrivers,
    fetchEmployees,
    fetchInvitation,
    fetchSingleEmployee
} from "@/services/employeeService";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
        .string()
        .email({ message: "Invalid email address" }),
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
 * Get a single employee by ID for the active organization
 * @param id the id of the required employee
 * @returns the employee data or null 
 */
export async function getEmployeeById(id: string) {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ['owner', 'manager']
        });

        const employee = await fetchSingleEmployee({ id, organizationId });

        return employee
    } catch (error: any) {
        console.error("[getEmployeeById] Error fetching employee:", error?.message);
        return null;
    }
}

export type EmployeeType = Awaited<ReturnType<typeof getEmployeeById>>;

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
export async function addEmployee(data: FormData) {
    try {
        const { role, organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });
        const { name, email, role: newRole, password } = Object.fromEntries(data)
        if (role === 'manager' && (data.get("role") === 'owner' || 'manager')) {
            throw new Error("Unauthorized: You're not allowed to set this role.");
        }

        const validated = formSchema.safeParse({
            name,
            email,
            role: newRole,
            password
        });

        if (!validated.success) {
            console.error("[addEmployee] Validation errors:", validated.error.flatten().fieldErrors);
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

/**
 * Invite an employee to the organization via email
 * @param formData - FormData containing email and role of the employee to invite
 * @returns Object with status and message indicating success or failure
 */
export async function inviteEmployee(formData: FormData) {
    try {
        const { role, organizationId, userId } = await getRequiredSessionContext({
            allowedRoles: ["owner", "manager"],
        });

        const email = formData.get("email") as string;
        const staffRole = formData.get("role") as string;

        if (!email || !staffRole) {
            return { status: "error", message: "Email and role are required." };
        }

        console.log('inviteEmployee called with email: ', role, ' and role: ', staffRole);

        //manager can't invite owner or manager
        if (role === 'manager' && (staffRole === 'owner' || staffRole === 'manager')) {
            throw new Error("Unauthorized: You're not allowed to invite this role.");
        }

        //invite the employee
        const data = await auth.api.createInvitation({
            body: {
                email,
                role: staffRole as "owner" | "manager" | "driver",
                organizationId,
            },
            headers: await headers()
        });

        if (!data.id) {
            throw new Error("Failed to send invitation. Please try again.");
        }

        return {
            status: "success",
            message: "Invitation sent successfully.",
        };
    } catch (error: any) {
        console.error("[inviteEmployee] Error:", error?.message);
        return { status: "error", message: error?.message || "An error occurred while inviting employee." };
    }
}

/**
 * Invite multiple employees to the organization via email in bulk when create the account
 * @param invites - Array of objects containing email and role of the employees to invite
 * @returns Object with success status and message indicating success or failure
 */
interface BulkInviteProps {
    invites: Array<{
        email: string;
        role: "owner" | "manager" | "driver";
    }>;
}

export async function inviteEmployeeInBulk({ invites }: BulkInviteProps) {
    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner"],
        });

        //check the length of the invites array
        if (invites.length > 5) {
            throw new Error("You can invite a maximum of 5 members at a time.");
        }

        //invite the employees
        for (const invite of invites) {
            const { email, role } = invite;

            if (!email || !role) {
                throw new Error("Email and role are required for each invite.");
            }

            const data = await auth.api.createInvitation({
                body: {
                    email,
                    role,
                    organizationId,
                },
                headers: await headers()
            });

            if (!data.id) {
                console.error(`Failed to send invitation to ${email}.`);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay of 1s between invites
        }

        return {
            success: true,
            message: "Invitations sent successfully.",
        };

    } catch (error: any) {
        console.error("[inviteEmployeeInBulk] Error:", error?.message);
        return {
            success: false,
            message: error?.message || "An error occurred while inviting employees in bulk."
        };
    }
}

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


export async function getInvitationDetails({ invitationId, email }: { invitationId?: string, email?: string }) {
    if (!invitationId && !email) {
        return null;
    }

    try {
        const invitation = await fetchInvitation({ invitationId, email });

        return invitation;
    } catch (error: any) {
        console.error("[getInvitationDetails] Error:", error?.message);
        return null;
    }
}
export type InvitationType = Awaited<ReturnType<typeof getInvitationDetails>>;


export async function deleteEmployee(employeeEmail: string) {
    if (!employeeEmail) {
        return { status: "error", message: "No employee email provided for deletion." };
    }

    try {
        const { organizationId } = await getRequiredSessionContext({
            allowedRoles: ["owner"],
        });

        const data = await auth.api.removeMember({
            body: {
                memberIdOrEmail: employeeEmail,
                organizationId
            },
            headers: await headers()
        });

        if (!data.member) {
            throw new Error("Failed to delete employee. Please try again.");
        }

        revalidatePath("/employees");
        return {
            status: "success",
            message: `Employee with email ${employeeEmail} deleted successfully.`,
        }
    } catch (error: any) {
        console.error("[deleteEmployee] Error:", error?.message);
        return {
            status: "error",
            message: error?.message || "An error occurred while deleting employee."
        };
    }
}