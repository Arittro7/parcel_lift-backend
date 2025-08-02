import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { ParcelRoutes } from "../modules/Parcel/parcel.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/parcels",
    route: ParcelRoutes
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
