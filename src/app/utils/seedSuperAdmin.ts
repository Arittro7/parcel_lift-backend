import bcryptjs from 'bcryptjs';
import { envVars } from "../config/env"
import { User } from '../modules/User/user.model';
import { IAuthProvider, IUser, Role, UserStatus } from '../modules/User/user.interface';

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })

    if (isSuperAdminExist) {
      console.log("⚠️ Administrator is Here");
      return;
    }

    console.log("⚙️ Creating Super Admin...");

    const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL
    }

    const payload: IUser = {
      name: "Parcel Lift Administrator",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      status: UserStatus.ACTIVE,
      auths: [authProvider]
    }

    const superAdmin = await User.create(payload)
    console.log("✅ Administrator is observing you 👮🏻");
    console.log(superAdmin);
  } catch (error) {
    console.log("❌ Super Admin seeding failed:", error);
  }
}
