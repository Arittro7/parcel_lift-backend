import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import bcryptjs from "bcryptjs";
import { User } from '../User/user.model';
import { IUser} from '../User/user.interface';
import { createNewAccessTokenWithRefreshToken, createUsersToken } from '../../utils/usersToken';

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

const getNewAccessToken = async(refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)
  return{
    accessToken : newAccessToken
  }
}



export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
};

