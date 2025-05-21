import { Request, Response } from "express";
import { Staff } from "../models/staffModel";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { username, password, name, phone, dob, avatar } = req.body;

    if (!username || !password || !name || !phone) {
      res.status(400).json({
        error: "Vui lòng nhập đầy đủ username, password, name, phone, và dob",
      });
    }

    const existingUser = await Staff.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Username đã tồn tại" });
    }

    const existingPhone = await Staff.findOne({ phone });
    if (existingPhone) {
      res.status(400).json({ error: "Số điện thoại đã được sử dụng" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new Staff({
      username,
      password: hashedPassword,
      name,
      phone,
      dob,
      avatar,
      role: "staff",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Tạo nhân viên thành công",
      user: {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        phone: newUser.phone,
        dob: newUser.dob,
        avatar: newUser.avatar,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhân viên:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại" });
  }
};

export const getStaff = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.params;

    if (staffId) {
      if (!mongoose.Types.ObjectId.isValid(staffId)) {
        res.status(400).json({ error: "ID nhân viên không hợp lệ" });
      }

      const staff = await Staff.findById(staffId).select("-password");

      if (!staff) {
        res.status(404).json({ error: "Nhân viên không tồn tại" });
      }

      res.status(200).json([staff]);
    }

    const staffList = await Staff.find().select("-password");

    res.status(200).json(staffList);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin nhân viên:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại" });
  }
};

export const updateStaffPassword = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.params;
    const { newPassword } = req.body;
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      res.status(400).json({ error: "ID nhân viên không hợp lệ" });
    } else {
      const staff = await Staff.findById(staffId);
      if (!staff || staff.role !== "staff") {
        res.status(404).json({ error: "Nhân viên không tồn tại" });
      } else {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        staff.password = hashedPassword;
        await staff.save();

        res
          .status(200)
          .json({ success: true, message: "Đổi mật khẩu thành công" });
      }
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật mật khẩu:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại" });
  }
};

export const updateStaffInfo = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.params;
    const { name, phone, dob, avatar } = req.body;

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      res.status(400).json({ error: "ID nhân viên không hợp lệ" });
    }

    const staff: any = await Staff.findById(staffId);
    // if (!staff || staff.role !== "staff") {
    //   res.status(404).json({ error: "Nhân viên không tồn tại" });
    // }

    if (name) staff.name = name;
    if (phone) {
      const existingPhone = await Staff.findOne({ phone });
      if (existingPhone && existingPhone._id.toString() !== staffId) {
        res.status(400).json({ error: "Số điện thoại đã được sử dụng" });
      }
      staff.phone = phone;
    }
    if (dob) staff.dob = dob;
    if (avatar) staff.avatar = avatar;

    await staff.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        _id: staff._id,
        username: staff.username,
        name: staff.name,
        phone: staff.phone,
        dob: staff.dob,
        avatar: staff.avatar,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại" });
  }
};
