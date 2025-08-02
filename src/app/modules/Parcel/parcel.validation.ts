import z from "zod";
import { ParcelStatus } from "./parcel.interface";

export const createParcelZodSchema = z.object({
    receiver: z
        .string({ message: "Receiver ID is required" })
        .regex(/^[a-f\d]{24}$/i, "Receiver must be a valid MongoDB ObjectId"),

    parcelType: z
        .string({ message: "Parcel type is required" })
        .min(2, "Parcel type must be at least 2 characters long"),

    weight: z
        .number({ message: "Weight is required" })
        .positive("Weight must be a positive number"),

    pickupAddress: z
        .string({ message: "Pickup address is required" })
        .min(5, "Pickup address must be at least 5 characters"),

    deliveryAddress: z
        .string({ message: "Delivery address is required" })
        .min(5, "Delivery address must be at least 5 characters"),

    fee: z
        .number({ message: "Fee is required" })
        .nonnegative("Fee must be a non-negative number"),
});

export const updateParcelStatusZodSchema = z.object({
    status: z.enum(Object.values(ParcelStatus) as [string, ...string[]], {
        message: "Status is required",
    }),
    note: z
        .string()
        .max(200, "Note cannot exceed 200 characters")
        .optional(),
});