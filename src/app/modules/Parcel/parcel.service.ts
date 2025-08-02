import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../User/user.model";
import { IParcel } from "./parcel.interface";
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
    parcelType: 
  })
}