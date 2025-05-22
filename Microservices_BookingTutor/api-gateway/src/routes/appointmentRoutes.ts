import express from "express";


/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: API quản lý lịch hẹn gia sư
 */


/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lấy danh sách appointment
 *     tags: [Appointment]
 *     parameters:
 *       - in: query
 *         name: filter[where][status]
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: filter[where][tutorId]
 *         schema:
 *           type: string
 *         description: Lọc theo ID gia sư
 *       - in: query
 *         name: filter[where][studentId]
 *         schema:
 *           type: string
 *         description: Lọc theo ID học sinh
 *       - in: query
 *         name: filter[where][_id]
 *         schema:
 *           type: string
 *         description: Lọc theo ID cụ thể
 *       - in: query
 *         name: filter[include]
 *         schema:
 *           type: string
 *         description: Include relationships (tutorId, studentId)
 *         example: "tutorId,studentId"
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra"
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Tạo appointment mới
 *     tags: [Appointment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tutorId
 *               - studentId
 *               - subject
 *               - price
 *               - grade
 *               - location
 *               - requirements
 *               - sessionsPerWeek
 *             properties:
 *               tutorId:
 *                 type: string
 *                 description: ID của gia sư (phải là ObjectId hợp lệ)
 *                 example: "60d5ecb54f3d2b001f5e4b8a"
 *               studentId:
 *                 type: string
 *                 description: ID của học sinh (phải là ObjectId hợp lệ)
 *                 example: "60d5ecb54f3d2b001f5e4b8b"
 *               subject:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách môn học
 *                 example: ["Toán", "Lý"]
 *               price:
 *                 type: number
 *                 minimum: 1
 *                 description: Giá tiền mỗi buổi học (phải là số dương)
 *                 example: 200000
 *               grade:
 *                 type: string
 *                 description: Lớp học
 *                 example: "Lớp 12"
 *               location:
 *                 type: string
 *                 description: Địa điểm học
 *                 example: "123 Nguyễn Văn Cừ, Q1, TP.HCM"
 *               requirements:
 *                 type: string
 *                 description: Yêu cầu đặc biệt
 *                 example: "Cần tập trung vào phần hình học"
 *               sessionsPerWeek:
 *                 type: number
 *                 minimum: 1
 *                 description: Số buổi học mỗi tuần (phải là số nguyên dương)
 *                 example: 3
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: Trạng thái appointment (mặc định là pending)
 *                 example: "pending"
 *               source:
 *                 type: string
 *                 description: Nguồn tạo appointment
 *                 example: "web_app"
 *               notes:
 *                 type: string
 *                 description: Ghi chú thêm
 *                 example: "Học sinh cần hỗ trợ đặc biệt"
 *               area:
 *                 type: string
 *                 description: Khu vực
 *                 example: "Quận 1"
 *               studyGoal:
 *                 type: string
 *                 description: Mục tiêu học tập
 *                 example: "Chuẩn bị thi đại học"
 *     responses:
 *       201:
 *         description: Tạo appointment thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_fields:
 *                       value: "Vui lòng cung cấp đầy đủ thông tin bắt buộc: tutorId, studentId"
 *                     invalid_id:
 *                       value: "tutorId hoặc studentId không hợp lệ, phải là ObjectId"
 *                     invalid_price:
 *                       value: "Price phải là số dương"
 *                     invalid_sessions:
 *                       value: "sessionsPerWeek phải là số nguyên dương"
 *                     invalid_status:
 *                       value: "Status không hợp lệ"
 *       404:
 *         description: Không tìm thấy tutor hoặc student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy tutor hoặc student trong hệ thống"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Cập nhật appointment
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của appointment cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorId:
 *                 type: string
 *                 description: Cập nhật ID gia sư
 *                 example: "60d5ecb54f3d2b001f5e4b8a"
 *               studentId:
 *                 type: string
 *                 description: Cập nhật ID học sinh
 *                 example: "60d5ecb54f3d2b001f5e4b8b"
 *               subject:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Cập nhật môn học
 *                 example: ["Toán", "Hóa"]
 *               price:
 *                 type: number
 *                 description: Cập nhật giá tiền
 *                 example: 250000
 *               grade:
 *                 type: string
 *                 description: Cập nhật lớp học
 *                 example: "Lớp 11"
 *               location:
 *                 type: string
 *                 description: Cập nhật địa điểm
 *                 example: "456 Lê Văn Sỹ, Q3, TP.HCM"
 *               requirements:
 *                 type: string
 *                 description: Cập nhật yêu cầu
 *                 example: "Tập trung vào bài tập khó"
 *               sessionsPerWeek:
 *                 type: number
 *                 description: Cập nhật số buổi/tuần
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: Cập nhật trạng thái
 *                 example: "confirmed"
 *               source:
 *                 type: string
 *                 description: Cập nhật nguồn
 *               notes:
 *                 type: string
 *                 description: Cập nhật ghi chú
 *               area:
 *                 type: string
 *                 description: Cập nhật khu vực
 *               studyGoal:
 *                 type: string
 *                 description: Cập nhật mục tiêu học tập
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Không tìm thấy appointment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy appointment"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Xóa appointment
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của appointment cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa appointment thành công"
 *       404:
 *         description: Không tìm thấy appointment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy appointment với id: 60d5ecb54f3d2b001f5e4b8a"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra khi xóa"
 *                 error:
 *                   type: string
 */

