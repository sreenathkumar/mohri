'use server'

import crypto from "crypto";
import dbConnect from "@/dbConnect";
import User from "@/models/userModel";
import TeamInvite from "@/models/teamInviteModel";
import { z } from "zod";
import { getServerSessionContext } from "@/lib/checkServerAuth";
import Membership from "@/models/membershipModel";
import { revalidatePath } from "next/cache";
import registerUser from "@/actions/auth/register";


// Allowed email domains
const allowedEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

// Form schema for validating the form data
const formSchema = z.object({
    name: z.string({ message: "Name is required" }),
    email: z.string().email().refine((email) => {
        // Extract the domain from the email
        const domain = email.split('@')[1];
        // Check if the domain is in the allowed list
        return allowedEmailDomains.includes(domain);
    }, {
        message: 'Only Gmail, Yahoo, and Outlook emails are allowed.',
    }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    role: z.string({ message: "Role is required" })
});

//check if the email already exists in the database
export async function checkEmployeeEmail(email: string) {
    try {
        const { role } = await getServerSessionContext();

        if (role !== 'merchant') {
            throw new Error("Unauthorized: Only merchants can add employees.");
        }

        //query the database for the user with the given email
        const user = await User.findOne({ email });

        //check if it's already an employee 
        if (user) {
            const membership = await Membership.findOne({ user: user._id });

            if (membership) {
                return {
                    exists: true,
                    isEmployee: true,
                    message: "User is already an employee",
                }
            } else {
                return {
                    exists: true,
                    isEmployee: false,
                    message: "User exists but is not an employee",
                }
            }
        } else {
            return {
                exists: false,
                message: "Email does not exist",
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in checking employee email: ', error?.message);
        return {
            status: 'error',
            message: error.message,
        }
    }
}

//function to add an employee
export async function addEmployee(preveState: unknown, data: FormData) {
    try {
        const { role, merchantId } = await getServerSessionContext();

        if (role !== 'merchant') {
            throw new Error("Unauthorized: Only merchants can add employees.");
        }

        const { name, email, password, role: staffRole } = Object.fromEntries(data);
        const validatedFields = formSchema.safeParse({
            name,
            email,
            password,
            role: staffRole
        });


        // Return early if the form data is invalid
        if (!validatedFields.success) {
            return {
                status: 'error',
                message: "Invalid form data. Please check your inputs",
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        //check if the user already exists
        const user = await User.findOne({ email });

        if (user) {
            //create the membership document for the employee
            await Membership.create({
                user: user._id,
                merchant: merchantId,
                role: data.get('role') as string
            });
        } else {
            const registerResult = await registerUser({ name: name as string, email: email as string, password: password as string });

            if (registerResult.status === 'error') {
                return {
                    status: 'error',
                    message: registerResult.message,
                    errors: registerResult.errors,
                }
            }

            //create the membership document for the employee
            await Membership.create({
                user: registerResult.userId,
                merchant: merchantId,
                role: data.get('role') as string
            });
        }

        return {
            status: 'success',
            message: "Employee registered successfully.",
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in adding employee: ', error?.message);
        return {
            status: 'error',
            message: error.message,
        }
    } finally {
        // Revalidate the employees page to reflect the new employee
        revalidatePath('/employees');
    }
}

export async function inviteEmployee(preveState: unknown, data: FormData) {
    if (!data.get('email') || !data.get('role')) {
        return {
            status: 'error',
            message: "Email and role are required",
        }
    }

    try {
        const { role, merchantId } = await getServerSessionContext();

        if (role !== 'merchant') {
            throw new Error("Unauthorized: Only merchants can invite employees.");
        }

        const token = crypto.randomBytes(32).toString('hex');

        //store the invitation token in the database with the email and role
        await TeamInvite.findOneAndUpdate({ email: data.get('email') }, {
            $set: {
                token,
                owner: merchantId,
                role: data.get('role') as string
            }
        }, { upsert: true });

        //send the invitation email to the employee with the token

        return {
            status: 'success',
            link: `${process.env.NEXT_PUBLIC_BASE_URL}/invite?token=${token}`,
            message: "Employee invited successfully. Please share the invitation link with the employee.",
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in inviting employee: ', error?.message);
        return {
            status: 'error',
            message: error.message,
        }
    }
}

//function to get all employees
export async function getAllEmployees() {
    try {
        const { role, merchantId } = await getServerSessionContext();

        if (role !== 'merchant') {
            throw new Error("Unauthorized: Only merchants can view employees.");
        }

        //query the database for all employees
        const memberships = await Membership.find({ merchant: merchantId }).select(['user', 'role'])
            .populate('user', 'name email image')
            .lean();


        //return the employees
        if (memberships && memberships.length > 0) {
            const transformedEmployees = memberships.map((item) => {
                return {
                    id: item.user._id?.toString() || item.user.email,
                    name: item.user.name,
                    email: item.user.email,
                    role: item.role,
                    image: item.user.image
                }
            });

            return transformedEmployees;
        }

        return [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error.message);
        return [];
    }
}

//function to update an employee
export async function updateEmployee(id: string, data: FormData) {
    const { name, email, role } = Object.fromEntries(data);
    const validatedFields = formSchema.safeParse({
        name,
        email,
        role
    });

    // Return early if the form data is invalid
    if (!validatedFields.success) {
        return {
            status: 'error',
            message: "Invalid form data. Please check your inputs",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {

        //connect to the database
        await dbConnect();

        //query the database for the employee with the given id and update the employee
        const employee = await User.findByIdAndUpdate(id, { name, email, role }, { new: true })

        //return the employee
        if (employee) {
            return {
                status: 'success',
                message: 'Employee updated successfully',
            }
        }

        return {
            status: 'error',
            message: 'Employee not found',
            errors: {
                name: ['Employee not found'],
                email: ['Employee not found']
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.log(error?.message)
        return {
            status: 'error',
            message: 'An error occurred',
            errors: {
                name: ['An error occurred'],
                email: ['An error occurred']
            }
        }
    }
}

//function to delete employees
export async function deleteEmployees(ids: string[]) {

    try {
        //connect to the database
        await dbConnect();

        //query the database for the employees with the given ids and delete the employees
        const employees = await User.deleteMany({ _id: { $in: ids } });

        //return the employees
        if (employees.deletedCount && employees.deletedCount > 0) {
            return {
                status: 'success',
                message: 'Employees deleted successfully',
            }
        }

        return {
            status: 'error',
            message: 'Employees not found',
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error?.message)
        return {
            status: 'error',
            message: 'An error occurred',

        }
    }
}

//function get all the drivers
export async function getAllDrivers() {
    try {
        //connect to the database
        await dbConnect();

        //query the database for all drivers
        const drivers = await User.find({ role: 'driver' }).select(['_id', 'name', 'email', 'role', 'image']).lean();

        //return the drivers
        if (drivers && drivers.length > 0) {
            const transformedDrivers = drivers.map((item) => {
                return {
                    id: item._id?.toString() || item.email,
                    name: item.name,
                    image: item.image
                }
            });

            return transformedDrivers;
        }

        return [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log('error in getting drivers: ', error?.message);
        return [];
    }
}