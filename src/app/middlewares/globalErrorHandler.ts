/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import mongoose from "mongoose";

interface TErrorSources {
  path: string; //string from typeScript
  message: string;
}

interface TGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: TErrorSources[];
}

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const duplicate = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${duplicate[1]} already Exist`,
  };
};

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid Object Id, Please Provide a Correct Object Id",
  };
};

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  //🔦
  const errorSources: TErrorSources[] = [];
  const errors = Object.values(err.errors);

  errors.forEach((errorObject: any) =>
    errorSources.push({
      path: errorObject.path,
      message: errorObject.message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

const handleZodError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  err.issues.forEach((issue: any) => {
    errorSources.push({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });

  return {
    statusCode: 400,
    message: "Zod Validation",
    errorSources,
  };
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }
  let errorSources: TErrorSources[] = [];

  let statusCode = 500;
  let message = "Something went wrong!";

  //`duplicate error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  //` Cast Object Id
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  //`Validation error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = simplifiedError.message;
  }
  //`ZOD Validation
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;

    errorSources = simplifiedError.errorSources as TErrorSources[];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};

// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextFunction, Request, Response } from "express";
// import { envVars } from "../config/env";
// import AppError from "../errorHelpers/AppError";

// export const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log(err);

//   const errorSources: any = [];
//   let statusCode = 500;
//   let message = "Something went wrong!";

//   // Duplicate Key Error
//   if (err.code === 11000) {
//     console.log("Duplicate entry detected", err.message);
//     const duplicate = err.message.match(/"([^"]*)"/);
//     statusCode = 400;
//     message = `${duplicate?.[1]} already exists`;
//   }

//   // Cast Error (Invalid ObjectId)
//   else if (err.name === "CastError") {
//     statusCode = 400;
//     message = "Invalid ObjectId. Please provide a valid MongoDB ObjectId.";
//   }

//   // Validation Error (Type/Enum Mismatch)
//   else if (err.name === "ValidationError") {
//     const errors = Object.values(err.errors);
//     errors.forEach((errorObj: any) =>
//       errorSources.push({
//         path: errorObj.path,
//         message: errorObj.message,
//       })
//     );
//     statusCode = 400;
//     message = "Validation error occurred";
//   }

//   // AppError (Custom Errors)
//   else if (err instanceof AppError) {
//     statusCode = err.statusCode;
//     message = err.message;
//   }

//   // General JS Error
//   else if (err instanceof Error) {
//     statusCode = 500;
//     message = err.message;
//   }
//   // zod Validation
//   else if (err.name === "ZodError") {
//     statusCode = 400;
//     message = err.message;
//     console.log(err.issues);
//     err.issues.forEach((issue: any) => {
//       errorSources.push({
//         path: issue.path[issue.path.length - 1],
//         message: issue.message,
//       });
//     });
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     errorSources,
//     err,
//     stack: envVars.NODE_ENV === "development" ? err.stack : null,
//   });
// };
