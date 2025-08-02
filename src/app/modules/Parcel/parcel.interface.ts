import { Types } from 'mongoose';

export enum ParcelStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface IStatusLog {
  status: ParcelStatus;
  timestamp: Date;
  updatedBy?: Types.ObjectId;
  note?: string;
}

export interface IParcel {
  _id?: Types.ObjectId;
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: string;
  weight: number;
  senderAddress: string;
  receiverAddress: string;
  fee: number;
  status: ParcelStatus;
  statusLogs: IStatusLog[];
  isBlocked: boolean;
}