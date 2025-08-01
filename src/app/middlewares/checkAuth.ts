import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: string[]) =>async(req: Request, res:Response, next: NextFunction) =>{
  try {
    const accessToken = req.headers.authorization

    if(!accessToken){
        throw new AppError(403, "No Token Received")
    }
    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

    req.user = verifiedToken

    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(403, "You are not permitted to view this route");
    }

    console.log("Verified Token", verifiedToken);
    next()

  } catch (error) {
    console.log("JWT Error:", error);
    next(error)
  }
}