import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  console.log("Token received:", token); // Kiểm tra token nhận được

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
  } else {
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("Thiếu JWT_SECRET trong biến môi trường");
      }
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
      console.log("Decoded token:", decoded);
      req.user = { id: decoded.userId, role: decoded.role };
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token." });
    }
  }
};



export default authMiddleware;
