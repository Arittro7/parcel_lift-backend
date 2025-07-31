import z from "zod";
import { Role, UserStatus } from "./user.interface";

export const createUserZodSchema = z.object({
      name: z.string({message: "Name must be string"}).min(2, {message: "Name too short minimum 2 character required"}).max(50, {message: "Name too long"}),
      // `Name 👆🏾 Email 👇🏾 
      email: z
        .string({ message: "Email must be string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email must be at least 5 character long" })
        .max(100, { message: "Email cannot exceed 100 character" }),
      //` Password 
        password: z
        .string({ message : "Password must be string" })
        .min(8, { message: "Password must be at least 8 character long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
      //`Phone 
      phone: z 
        .string({message: "Phone Number must be String"})
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
      //`Address 
      address: z
        .string({message: "Address must be string"})
        .max(200, {message: "Address cannot exceed 200 character"})
        .optional(),
      
  })

// Duplicate the createUserZodSchema for updateUserZodSchema
/**
 * User may update only one filed, that's why add optional() in every field
 * Email can't be updated
 */
export const updateUserZodSchema = z.object({
    name: z
        .string({ message: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
        
        // Email can't be updated

    password: z
        .string({ message: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }).optional(),
    phone: z
        .string({ message: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    status: z
        .enum(Object.values(UserStatus.ACTIVE) as [string])
        .optional(),
    isDeleted: z
        .boolean().optional(),
    isVerified: z
        .boolean().optional(),
    address: z
        .string({ message: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()
})