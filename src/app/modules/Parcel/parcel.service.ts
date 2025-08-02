import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../User/user.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import { generateTrackingId } from '../../utils/generateTrackingId';
import { Parcel } from './parcel.model';

const createParcel = async (senderId: string, payload: Partial<IParcel>) =>{
  const sender = await User.findById(senderId)
  if(!sender){
    throw new AppError(httpStatus.NOT_FOUND, "Sender not found")
  }

  const receiver = await User.findById(payload.receiver)

  if(!receiver){
    throw new AppError(httpStatus.NOT_FOUND, "Receiver not found")
  }

  const trackingId = await generateTrackingId()

  const parcel = await Parcel.create({
    trackingId,
    sender: sender._id,
    receiver: payload.receiver,
    parcelType: payload.parcelType,
    weight: payload.weight,
    pickupAddress: payload.pickupAddress,
    deliveryAddress: payload.deliveryAddress,
    fee: payload.fee,
    parcelStatus: ParcelStatus.REQUESTED,
    statusLogs: [
      {
        status: ParcelStatus.REQUESTED,
        updatedBy: sender._id,
        note: "Parcel created by Sender",
        timestamp: new Date()
      }
    ]
  })

  return parcel
}

export const ParcelServices = {
  createParcel
}