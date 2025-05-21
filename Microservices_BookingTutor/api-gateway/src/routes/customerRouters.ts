import express from "express";


const customerRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Quản lý khách hàng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - username
 *         - fullName
 *         - phoneNumber
 *         - typeCustomer
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động tạo của khách hàng
 *         username:
 *           type: string
 *           description: Tên đăng nhập (thường là số điện thoại)
 *         fullName:
 *           type: string
 *           description: Họ và tên đầy đủ
 *         phoneNumber:
 *           type: string
 *           description: Số điện thoại
 *         email:
 *           type: string
 *           description: Địa chỉ email (không bắt buộc)
 *         avatar:
 *           type: string
 *           description: URL ảnh đại diện
 *         active:
 *           type: boolean
 *           description: Trạng thái tài khoản (true=hoạt động, false=bị khóa)
 *           default: true
 *         typeCustomer:
 *           type: string
 *           enum: [highschool_student, university_student, employee]
 *           description: Loại khách hàng
 *         area:
 *           type: string
 *           description: Khu vực sống (không bắt buộc)
 *         dob:
 *           type: string
 *           format: date
 *           description: Ngày sinh (không bắt buộc)
 *         gender:
 *           type: string
 *           enum: ['0', '1', '2']
 *           description: Giới tính (0=Khác, 1=Nam, 2=Nữ) (không bắt buộc)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tài khoản
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 *       example:
 *         _id: "681cf58c019be626a2aaf1ec"
 *         username: "0795528133"
 *         fullName: "HS Danhhhh"
 *         phoneNumber: "0795528133"
 *         email: "danhlove222@gmail.com"
 *         avatar: ""
 *         active: true
 *         typeCustomer: "highschool_student"
 *         area: "tinh_dien_bien"
 *         dob: null
 *         gender: "1"
 *         createdAt: "2025-05-08T18:18:52.113Z"
 *         updatedAt: "2025-05-21T02:59:02.561Z"
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Lấy danh sách tất cả khách hàng
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Danh sách khách hàng lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi sever"
 */


/**
 * @swagger
 * /api/customers/{customerId}:
 *   put:
 *     summary: Cập nhật thông tin khách hàng
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khách hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Họ và tên đầy đủ
 *               phoneNumber:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 description: Địa chỉ email
 *               avatar:
 *                 type: string
 *                 description: URL ảnh đại diện
 *               typeCustomer:
 *                 type: string
 *                 enum: [highschool_student, university_student, employee]
 *                 description: Loại khách hàng
 *               active:
 *                 type: boolean
 *                 description: Trạng thái tài khoản (true=hoạt động, false=bị khóa)
 *               area:
 *                 type: string
 *                 description: Khu vực sống
 *               dob:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh
 *               gender:
 *                 type: string
 *                 enum: ['0', '1', '2']
 *                 description: Giới tính (0=Khác, 1=Nam, 2=Nữ)
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu mới (nếu cần đổi)
 *             example:
 *               fullName: "Học Sinh Danh"
 *               email: "danhlove222@gmail.com"
 *               typeCustomer: "highschool_student"
 *               area: "tinh_dien_bien"
 *               gender: "1"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin khách hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Không tìm thấy khách hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 *                 customerId:
 *                   type: string
 *                   example: "681cf58c019be626a2aaf1ec"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating user"
 *                 error:
 *                   type: object
 */


export default customerRoutes;