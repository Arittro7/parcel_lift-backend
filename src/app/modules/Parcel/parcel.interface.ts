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
    parcelType: string;
    weight: number;
    pickupAddress: string;
    deliveryAddress: string;
    fee: number;
    parcelStatus: ParcelStatus;
    statusLogs: IStatusLog[];
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}