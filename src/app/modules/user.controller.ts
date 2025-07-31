/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userService } from "./user.service";
import { catchAsync } from "../utils/catchAsync";

const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  try {
    
    const user = await userService.createUser(req.body)
    
    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user
    })
    

  } catch (err : any) {
    console.log(err);
    next(err)
  }
})

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
  const users = await userService.getAllUsers()

  res.status(httpStatus.OK).json({
    success: true,
    message: "All User retrieved successfully",
    data: users
  })
})

export const UserController = {
  createUser,
  getAllUsers
}