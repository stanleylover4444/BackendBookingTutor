import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import { Customer } from "../models/customerModel";

const authRegister = async (req: Request, res: Response) => {
  try {
   
    const requiredFields = ['fullName', 'phoneNumber', 'password', 'type'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    }
    
    if (req.body.type === 'user' && !req.body.educationLevel) {
      missingFields.push('educationLevel');
    } else if (req.body.type === 'customer' && !req.body.typeCustomer) {
      missingFields.push('typeCustomer');
    }
    
    if (missingFields.length > 0) {
       res.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
        missingFields: missingFields
      });
      return
    }
    
    const {
      fullName,
      phoneNumber,
      email, 
      password,
      type,
      educationLevel,
      typeCustomer,
    } = req.body;
    

    const existingUser = await User.findOne({ phoneNumber });
    const existingCustomer = await Customer.findOne({ phoneNumber });

    if (existingUser || existingCustomer) {
       res.status(400).json({
        message: "Số điện thoại đã được sử dụng."
      });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (type === "user") {
      newUser = new User({
        username: phoneNumber,
        fullName,
        phoneNumber,
        email: email || "", 
        educationLevel,
        password: hashedPassword,
      });
    } else if (type === "customer") {
      newUser = new Customer({
        username: phoneNumber,
        fullName,
        phoneNumber,
        email: email || "",
        typeCustomer,
        password: hashedPassword,
      });
    } else {
       res.status(400).json({
        message: "Loại tài khoản không hợp lệ. Vui lòng chọn 'user' hoặc 'customer'."
      });
      return
    }

    // Lưu người dùng mới vào database
    await newUser.save();
     res.status(201).json({
      message: "Đăng ký thành công",
      data: {
        userId: newUser._id,
      },
    });
    return
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
     res.status(500).json({ 
      message: "Lỗi server", 
      error: error.message 
    });
    return
  }
};

const authLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;

    let user: any = await User.findOne({ username }).select("+password");
    let userType = "user";

    if (!user) {
      user = await Customer.findOne({ username }).select("+password");
      userType = "customer";
    }

    if (!user || !user.password) {
      res.status(400).json({ message: "Username hoặc password không đúng" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Password không đúng" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, type: userType },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const Test = async (req: Request, res: Response): Promise<void> => {
  console.log("concac");
  res.status(200).json("Pong!");
};

const TestAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    res.status(200).json({ success: true, message: `Received: ${message}` });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export { authRegister, authLogin, Test, TestAuth };
