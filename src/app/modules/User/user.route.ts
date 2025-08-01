import {  NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema } from './user.validation';
import { validateRequest } from "../../middlewares/validateRequest";
import AppError from "../../errorHelpers/AppError";
import jwt from "jsonwebtoken"

const router = Router();

router.post("/register",validateRequest(createUserZodSchema),UserController.createUser);
router.get("/all-users",async(req: Request, res:Response, next: NextFunction) =>{
  try {
    const accessToken = req.headers.authorization

    if(!accessToken){
        throw new AppError(403, "No Token Received")
    }
    const verifiedToken = jwt.verify(accessToken, "SECRET")

    // if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
    //   throw new AppError(403, "You are not permitted to view this route");
    // }

    console.log("Verified Token", verifiedToken);
    next()

  } catch (error) {
    next(error)
  }
} ,UserController.getAllUsers);

export const UserRoutes = router;
