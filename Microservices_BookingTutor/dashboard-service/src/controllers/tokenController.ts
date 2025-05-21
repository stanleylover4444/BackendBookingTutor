import { Request, Response } from "express";
import { Staff } from "../models/staffModel";

const findProfileByToken = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(400).json({ message: "Không có thông tin người dùng" });
    }

    const user = await Staff.findById(userId).select("-password");
    if (!user) {
       res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

export { findProfileByToken };
