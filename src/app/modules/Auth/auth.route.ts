import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)
router.get("/google", (req: Request, res: Response, next: NextFunction) =>{
  passport.authenticate("google", { scope: ["profile", "email"]})(req, res, next)})
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}),AuthController.googleCallbackController)

export const AuthRoutes = router;
