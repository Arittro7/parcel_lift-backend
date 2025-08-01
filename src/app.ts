import cors from "cors"
import express, { Request, Response }  from "express"
import { router } from "./app/routes"
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler"
import notFound from "./app/middlewares/notFound"
import cookieParser from "cookie-parser"
import expressSession from "express-session";
import passport from "passport";
import { envVars } from "./app/config/env"
import "./app/config/passport"


const app = express()
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET, // 🔒 Use a secure secret from .env
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to 📦Parcel Lift Backend Server"
  })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;
