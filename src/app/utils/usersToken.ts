import { envVars } from "../config/env";
import { IUser } from "../modules/User/user.interface";
import { generateToken } from "./jwt";


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
