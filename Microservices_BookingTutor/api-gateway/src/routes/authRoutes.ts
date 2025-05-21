import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - password
 *               - type
 *               - educationLevel
 *             properties:
 *               username:
 *                 type: string
 *                 example: NguyenVanP123
 *               fullName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               phoneNumber:
 *                 type: string
 *                 example: "0123451233"
 *               username:
 *                 type: string
 *                 example: "user@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "mypassword"
 *               type:
 *                 type: string
 *                 enum: [user, tutor, admin]
 *                 example: "user"
 *               educationLevel:
 *                 type: string
 *                 example: "Đại học"
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *         
 *               password:
 *                 type: string
 *                 format: password
 *                
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Sai email hoặc mật khẩu
 */

export default router;
