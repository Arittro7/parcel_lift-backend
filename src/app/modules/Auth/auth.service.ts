import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";
import { User } from '../User/user.model';
import { IUser } from '../User/user.interface';
import jwt from "jsonwebtoken"

const credentialsLogin = async (payload : Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string, 
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role
  }

  const accessToken = jwt.sign(jwtPayload, "SECRET", {expiresIn: "1h"})

  return {
    accessToken
  };
};

export const AuthServices = {
  credentialsLogin
};

