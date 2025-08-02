/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
      const user = await userService.createUser(req.body);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user,
      });  
  }
);

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  const verifiedToken = req.user as JwtPayload

  const payload = req.body;

  const user = await userService.updateUser(userId, payload, verifiedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Updated Successfully",
    data: user,
  });
});


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await userService.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Users Retrieve successfully",
      data: result.data,
      meta:result.meta 
    });
  }
);

const blockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;
    const decodedId = (req.user as JwtPayload).userId

    const result = await userService.blockUser(userId, decodedId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User blocked successfully',
        success: true,
        data: result,
    })
})

const unblockUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;

    const result = await userService.unblockUser(userId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User unblocked successfully',
        success: true,
        data: result,
    })
})

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  blockUser,
  unblockUser
};
