import z from 'zod';
import { ParcelStatus } from './parcel.interface';

export const createParcelZodSchema = z.object({
  receiver: z.string({ message: 'Receiver must have a valid ID' }).regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid receiver ID',
  }),
  type: z
    .string({ message: 'Type must be string' })
    .min(2, { message: 'Type must be at least 2 characters long.' })
    .max(50, { message: 'No more than 50 characters.' }),
  weight: z.number({ message: 'Weight must be a number' }).min(0.1, { message: 'Weight must be at least 0.1 kg' }),
  senderAddress: z
    .string({ message: 'Sender address must be string' })
    .min(5, { message: 'Sender address must be at least 5 characters long.' }),
  receiverAddress: z
    .string({ message: 'Receiver address must be string' })
    .min(5, { message: 'Receiver address must be at least 5 characters long.' }),
  fee: z.number({ message: 'Fee must be a number' }).min(0, { message: 'Fee cannot be negative' }),
});

export const updateParcelStatusZodSchema = z.object({
  status: z.enum(Object.values(ParcelStatus) as [string], { message: 'Invalid status' }),
});