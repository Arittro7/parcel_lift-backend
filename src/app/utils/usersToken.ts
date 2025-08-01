import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IUser, UserStatus} from "../modules/User/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/User/user.model";
import AppError from '../errorHelpers/AppError';


export const createUsersToken = (user : Partial<IUser>) =>{
  const jwtPayload = {
      userId : user._id, 
      email: user.email,
      role: user.role
    }
 
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    return{
      accessToken, refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (isUserExist?.status === UserStatus.BLOCKED || isUserExist?.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }

  if (isUserExist?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is DELETED");
  }

  const jwtPayload = {
    userId: isUserExist?._id,
    email: isUserExist?.email,
    role: isUserExist?.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

  return {
    accessToken
  };
};
