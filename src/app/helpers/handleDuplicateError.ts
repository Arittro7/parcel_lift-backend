import { TGenericErrorResponse } from "../interfaces/errorTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const duplicate = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${duplicate[1]} already Exist`,
  };
};