import express from "express";



/**
 * @swagger
 * tags:
 *   name: RequestOpen
 *   description: API quản lý yêu cầu tìm gia sư
 */


/**
 * @swagger
 * /api/requestOpen:
 *   get:
 *     summary: Lấy danh sách yêu cầu tìm gia sư
 *     tags: [RequestOpen]
 *     parameters:
 *       - in: query
 *         name: filter[where][status]
 *         schema:
 *           type: string
 *           enum: [waiting, accepted, completed, cancelled]
 *         description: Lọc theo trạng thái
 *       - in: query
 *         name: filter[where][createdBy]
 *         schema:
 *           type: string
 *         description: Lọc theo người tạo
 *       - in: query
 *         name: filter[where][_id]
 *         schema:
 *           type: string
 *         description: Lọc theo ID cụ thể
 *       - in: query
 *         name: filter[include]
 *         schema:
 *           type: string
 *         description: Include relationships (createdBy, tutorRequests, acceptedTutor)
 *         example: "createdBy,tutorRequests"
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RequestOpen'
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
 * /api/requestOpen:
 *   post:
 *     summary: Tạo yêu cầu tìm gia sư mới
 *     tags: [RequestOpen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subjects
 *               - educationLevel
 *               - specificLocation
 *               - pricePerSession
 *               - jobDescription
 *               - sessionsPerWeek
 *               - createdBy
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách môn học
 *                 example: ["Toán", "Lý"]
 *               educationLevel:
 *                 type: string
 *                 description: Cấp học
 *                 example: "Lớp 12"
 *               specificLocation:
 *                 type: string
 *                 description: Địa điểm cụ thể
 *                 example: "123 Nguyễn Văn Cừ, Q1, TP.HCM"
 *               pricePerSession:
 *                 type: number
 *                 description: Giá tiền mỗi buổi học
 *                 example: 200000
 *               jobDescription:
 *                 type: string
 *                 description: Mô tả công việc và yêu cầu
 *                 example: "Cần gia sư có kinh nghiệm dạy học sinh lớp 12"
 *               sessionsPerWeek:
 *                 type: number
 *                 description: Số buổi học mỗi tuần
 *                 example: 3
 *               createdBy:
 *                 type: string
 *                 description: ID người tạo request
 *                 example: "60d5ecb54f3d2b001f5e4b8a"
 *     responses:
 *       201:
 *         description: Tạo request thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestOpen'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vui lòng cung cấp đầy đủ thông tin bắt buộc: subjects, educationLevel"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requestOpen/{id}:
 *   put:
 *     summary: Cập nhật yêu cầu tìm gia sư
 *     tags: [RequestOpen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của request cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tutorRequests:
 *                 type: string
 *                 description: ID gia sư apply (thêm vào danh sách)
 *                 example: "60d5ecb54f3d2b001f5e4b8b"
 *               removeTutor:
 *                 type: string
 *                 description: ID gia sư cần xóa khỏi danh sách
 *                 example: "60d5ecb54f3d2b001f5e4b8c"
 *               status:
 *                 type: string
 *                 enum: [waiting, accepted, completed, cancelled]
 *                 description: Cập nhật trạng thái
 *               acceptedTutor:
 *                 type: string
 *                 description: ID gia sư được chấp nhận
 *               subject:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Cập nhật môn học
 *               grade:
 *                 type: string
 *                 description: Cập nhật cấp học
 *               location:
 *                 type: string
 *                 description: Cập nhật địa điểm
 *               price:
 *                 type: number
 *                 description: Cập nhật giá tiền
 *               requirements:
 *                 type: string
 *                 description: Cập nhật yêu cầu
 *               sessionsPerWeek:
 *                 type: number
 *                 description: Cập nhật số buổi/tuần
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestOpen'
 *       404:
 *         description: Không tìm thấy request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy request open"
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/requestOpen/{id}:
 *   delete:
 *     summary: Xóa yêu cầu tìm gia sư
 *     tags: [RequestOpen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của request cần xóa
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
 *                   example: "Xóa request open thành công"
 *       404:
 *         description: Không tìm thấy request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy request open với id: 60d5ecb54f3d2b001f5e4b8a"
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

