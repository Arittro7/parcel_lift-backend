import {  NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from './user.validation';
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/AppError";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";

const router = Router();

// checkAuth will check the authorization and authentication
const checkAuth = (...authRoles: string[]) =>async(req: Request, res:Response, next: NextFunction) =>{
  try {
    const accessToken = req.headers.authorization

    if(!accessToken){
        throw new AppError(403, "No Token Received")
    }
    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

    if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
      throw new AppError(403, "You are not permitted to view this route");
    }

    console.log("Verified Token", verifiedToken);
    next()

  } catch (error) {
    next(error)
  }
}

router.post("/register",validateRequest(createUserZodSchema),UserController.createUser);
router.get("/all-users",checkAuth(), UserController.getAllUsers);

export const UserRoutes = router;
