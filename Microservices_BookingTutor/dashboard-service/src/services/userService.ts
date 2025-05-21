import { User } from "../models/userModel";

export const updateUser = async (userData: any) => {
  if (!userData.userId) {
    console.error("❌ Missing userId in updateUser");
    return null;
  }

  return await User.findByIdAndUpdate(userData.userId, userData, {
    new: true,
    upsert: true,
  });
};
