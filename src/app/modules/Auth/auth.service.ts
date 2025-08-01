import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";
import { User } from '../User/user.model';
import { IUser, UserStatus } from '../User/user.interface';
import { createUsersToken } from '../../utils/usersToken';
import { generateToken, verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

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

  const userToken = createUsersToken(isUserExist)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest} = isUserExist.toObject()

  return {
    accessToken: userToken.accessToken, 
    refreshToken: userToken.refreshToken, 
    rest
  };
};

const getNewAccessToken = async (refreshToken: string) => {
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
    accessToken,
  };
};


export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
};

