import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Proxy to User Service)
 *     tags: [Users]
 *     description: API Gateway sẽ chuyển request này đến User Service.
 *     responses:
 *       200:
 *         description: Danh sách người dùng từ User Service
 *       500:
 *         description: Lỗi server
 */
router.use(
  "/users",
  createProxyMiddleware({
    target: "http://application-service:3001",
    changeOrigin: true,
  })
);

export default router;
