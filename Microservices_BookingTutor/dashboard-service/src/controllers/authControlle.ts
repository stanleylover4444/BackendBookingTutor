import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Staff } from "../models/staffModel";
import bcrypt from "bcryptjs";

type JwtPayload = { userId: string; role: string };

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await Staff.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      res.end();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ message: "Invalid credentials" });
        res.end();
      } else {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          throw new Error("Missing JWT_SECRET in environment variables");
        }

        const token = jwt.sign(
          { userId: user._id.toString(), role: user.role } as JwtPayload,
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          success: true,
          message: "Đăng nhập thành công",
          user: {
            _id: user._id,
            username: user.username,
            name: user.name,
            phone: user.phone,
            dob: user.dob,
            avatar: user.avatar,
            role: user.role,
          },
          token,
        });
      }
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
