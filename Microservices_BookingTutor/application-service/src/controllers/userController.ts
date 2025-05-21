import { User } from "../models/userModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sendToQueue } from "../config/rabbitmq";
import mongoose from "mongoose";

const getUsers = async (req: Request, res: Response) => {
  try {
    const filter: any = req.query.filter || {};
    const where = filter.where || {};
    const skip = parseInt(filter.skip) || 0;
    const limit = parseInt(filter.limit) || 50;

    if (where._id) {
      where._id = new mongoose.Types.ObjectId(where._id);
    }

    if (where.fullName) {
      where.fullName = { $regex: where.fullName, $options: "i" };
    }

    const users = await User.find(where)
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const {
      rejectedRequestOpens,
      appliedRequestOpens,
      password,
      ...otherFields
    } = req.body;
    const avatarFile = req.file;

    const updateData: any = { ...otherFields };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (avatarFile) {
      updateData.avatar = `/uploads/${avatarFile.filename}`;
    }

    if (rejectedRequestOpens || appliedRequestOpens) {
      updateData.$addToSet = {};
    }

    if (rejectedRequestOpens && typeof rejectedRequestOpens === "string") {
      updateData.$addToSet.rejectedRequestOpens = new mongoose.Types.ObjectId(
        rejectedRequestOpens
      );
    }

    if (appliedRequestOpens && typeof appliedRequestOpens === "string") {
      updateData.$addToSet.appliedRequestOpens = new mongoose.Types.ObjectId(
        appliedRequestOpens
      );
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // await sendToQueue("user_updates", {
    //   userId,
    //   ...updateData,
    // });

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};

export { getUsers, updateUser };
