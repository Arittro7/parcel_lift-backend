import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZodSchema } from "./parcel.validation";

const router = Router()

// SENDER
router.post("/", checkAuth(Role.SENDER), validateRequest(createParcelZodSchema, ParcelController.createParcel))

export const ParcelRoutes = router