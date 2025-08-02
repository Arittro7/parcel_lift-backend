import { model, Schema } from 'mongoose';
import { IParcel, IStatusLog, ParcelStatus } from './parcel.interface';

const statusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: String,
      maxlength: 200,
    },
  },
  { _id: false },
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parcelType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    weight: {
      type: Number,
      required: true,
      min: 0.1,
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
    parcelStatus: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.REQUESTED,
    },
    statusLogs: [statusLogSchema],
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Parcel = model<IParcel>('Parcel', parcelSchema);