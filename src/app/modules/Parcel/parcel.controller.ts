/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import { ParcelServices } from './parcel.service';

const createParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
  const senderId = (req.user as JwtPayload).userId
  const parcel = await ParcelServices.createParcel(senderId, req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Parcel created successfully",
    success: true,
    data: parcel
  })
})


export const ParcelController = {
  createParcel
}