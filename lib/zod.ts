import { z } from "zod";

export type FormState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
};

// signInSchema
export const signInSchema = z.object({
    email: z.string({ message: "Email is required" }),
    password: z.string({ message: "Password is required" }),
});

//update information schema
export const updateProfileSchema = z.object({
    name: z.string({ message: "Name is required" }),
    address: z.string({ message: "Address is required" }),
    phone: z.string({ message: "Phone number is required" }),
});

//woocommerce order schema for webhook
export const orderSchema = z.object({
    id: z.number({ message: "Order ID is required" }),
    total: z.string({ message: "Total amount is required" }),
    date_created: z.string(),
    billing: z.object({
        billing_phone_2: z.string({ message: "Phone number is required" }),
    }),
    payment_method: z.string({ message: "Payment method is required" }),
    date_created_gmt: z.string({ message: "Date created GMT is required" }),
    date_modified_gmt: z.string({ message: "Date modified GMT is required" }),
});

//update order coordinates schema

export const updateOrderCoordinateSchema = z.object({
    // Order ID validation
    orderId: z.string().min(1, "Order ID is required"),

    // Coordinate validations (coerced because FormData returns strings)
    latitude: z.coerce
        .number({ invalid_type_error: "Latitude must be a valid number" })
        .min(-90, "Latitude cannot be less than -90")
        .max(90, "Latitude cannot exceed 90"),

    longitude: z.coerce
        .number({ invalid_type_error: "Longitude must be a valid number" })
        .min(-180, "Longitude cannot be less than -180")
        .max(180, "Longitude cannot exceed 180"),
});