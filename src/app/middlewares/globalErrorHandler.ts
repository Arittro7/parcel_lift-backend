/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  const errorSources: any = [];
  let statusCode = 500;
  let message = "Something went wrong!";

  // Duplicate Key Error
  if (err.code === 11000) {
    console.log("Duplicate entry detected", err.message);
    const duplicate = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${duplicate?.[1]} already exists`;
  }

  // Cast Error (Invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ObjectId. Please provide a valid MongoDB ObjectId.";
  }

  // Validation Error (Type/Enum Mismatch)
  else if (err.name === "ValidationError") {
    const errors = Object.values(err.errors);
    errors.forEach((errorObj: any) =>
      errorSources.push({
        path: errorObj.path,
        message: errorObj.message,
      })
    );
    statusCode = 400;
    message = "Validation error occurred";
  }

  // AppError (Custom Errors)
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // General JS Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};


