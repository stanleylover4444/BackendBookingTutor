import express from "express";
import { authRegister, authLogin, Test, TestAuth } from "../controllers/authController";

const authRouters = express.Router();

authRouters.post("/register", authRegister);
authRouters.post("/login", authLogin);
authRouters.get("/ping", Test);
authRouters.post("/testAuthPost", TestAuth);


export default authRouters;
