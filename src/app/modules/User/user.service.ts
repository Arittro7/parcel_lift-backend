import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";
import { User } from "./user.model";
import  httpStatus  from 'http-status-codes';
import bcryptjs from "bcryptjs"
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const createUser = async (payload: Partial<IUser>) => {
  const {email, password, ...rest } = payload;

  const isUserExist = await User.findOne({email})

  if (isUserExist){
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10)

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string
  }

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
    role: payload.role || Role.SENDER
  })
  
  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
  }

  // 🧑‍⚖️ Restrict role updates for normal users/guides
  if (payload.role) {
    if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
      throw new AppError(httpStatus.FORBIDDEN, "Ya Habibi! You Are Not Authorized");
    }

    // ❌ Admins can't promote to super admin
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You Are Not Authorized");
    }
  }

  // 🔒 Restrict activity/status updates for normal users
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.RECEIVER || decodedToken.role === Role.SENDER) {
      throw new AppError(httpStatus.FORBIDDEN, "You Are Not Authorized");
    }
  }

  // 🔐 Password re-hashing
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  // ✅ Update & return new user
  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};


const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments()
  
  return{
    data: users,
    meta: {
      total: totalUsers
    }
  } ;
};

const getUserById = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

const blockUser = async (userId: string, decodedId: string) => {
    if (userId === decodedId) {
        throw new AppError(httpStatus.BAD_REQUEST, "You cannot block yourself");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: UserStatus.BLOCKED },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

const unblockUser = async (userId: string) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { isActive: UserStatus.ACTIVE },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

export const userService = {
  createUser,
  getAllUsers,
  updateUser,
  getUserById,
  blockUser,
  unblockUser
};
