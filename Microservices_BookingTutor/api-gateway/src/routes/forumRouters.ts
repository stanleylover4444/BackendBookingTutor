import express from "express";


/**
 * @swagger
 * tags:
 *   name: FORUM
 *   description: CRUD Diễn đàn
 */


/**
 * @swagger
 * /api/forums/posts:
 *   post:
 *     summary: Tạo một bài viết mới
 *     tags: [FORUM]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - authorModel
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung bài viết
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Hình ảnh đăng kèm bài viết
 *               imgUrl:
 *                 type: string
 *                 description: URL hình ảnh đăng kèm (nếu không upload file)
 *               author:
 *                 type: string
 *                 description: ID của tác giả
 *               authorModel:
 *                 type: string
 *                 enum: [User, Customer]
 *                 description: Loại tác giả (User hoặc Customer)
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forums/posts:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [FORUM]
 *     parameters:
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: Danh sách các trường cần populate (author,like), phân cách bằng dấu phẩy
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Bộ lọc dạng JSON. Ví dụ {"where":{"author":"123"},"limit":10,"skip":0}
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *                   - type: object
 *                     properties:
 *                       isLiked:
 *                         type: boolean
 *                         description: Người dùng hiện tại đã thích bài viết chưa
 *                       likeCount:
 *                         type: number
 *                         description: Số lượng like
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forums/posts/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một bài viết
 *     tags: [FORUM]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Thông tin bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /api/forums/posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [FORUM]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bài viết cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung bài viết mới
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách URL hình ảnh mới
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forums/posts/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     tags: [FORUM]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bài viết cần xóa
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully"
 *       400:
 *         description: ID không hợp lệ
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forum/comments:
 *   post:
 *     summary: Tạo một bình luận mới
 *     tags: [FORUM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *               - authorId
 *               - authorModel
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung bình luận
 *               postId:
 *                 type: string
 *                 description: ID của bài viết
 *               authorId:
 *                 type: string
 *                 description: ID của tác giả bình luận
 *               authorModel:
 *                 type: string
 *                 enum: [User, Customer]
 *                 description: Loại tác giả (User hoặc Customer)
 *               parentId:
 *                 type: string
 *                 description: ID của bình luận cha (nếu là trả lời bình luận)
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forum/comments/reply:
 *   post:
 *     summary: Trả lời một bình luận
 *     tags: [FORUM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - postId
 *               - authorId
 *               - parentId
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung trả lời
 *               postId:
 *                 type: string
 *                 description: ID của bài viết
 *               authorId:
 *                 type: string
 *                 description: ID của tác giả trả lời
 *               parentId:
 *                 type: string
 *                 description: ID của bình luận được trả lời
 *     responses:
 *       201:
 *         description: Trả lời bình luận thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forum/comments/{postId}:
 *   get:
 *     summary: Lấy danh sách bình luận của bài viết
 *     tags: [FORUM]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bài viết
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: Danh sách các trường cần populate (author,parent), phân cách bằng dấu phẩy
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Thiếu postId hoặc postId không hợp lệ
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forum/comments:
 *   put:
 *     summary: Cập nhật bình luận
 *     tags: [FORUM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *               - content
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID của bình luận cần cập nhật
 *               content:
 *                 type: string
 *                 description: Nội dung bình luận mới
 *     responses:
 *       200:
 *         description: Cập nhật bình luận thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy bình luận
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forum/comments:
 *   delete:
 *     summary: Xóa bình luận
 *     tags: [FORUM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *               - postId
 *             properties:
 *               commentId:
 *                 type: string
 *                 description: ID của bình luận cần xóa
 *               postId:
 *                 type: string
 *                 description: ID của bài viết
 *     responses:
 *       200:
 *         description: Xóa bình luận thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy bình luận
 *       500:
 *         description: Lỗi server
 */



/**
 * @swagger
 * /api/forum/toggleLike:
 *   post:
 *     summary: Thích hoặc bỏ thích bài viết
 *     tags: [FORUM]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *               - userModel
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID của bài viết
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *               userModel:
 *                 type: string
 *                 enum: [User, Customer]
 *                 description: Loại người dùng (User hoặc Customer)
 *     responses:
 *       200:
 *         description: Thích hoặc bỏ thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã like thành công"
 *                 liked:
 *                   type: boolean
 *                   description: Trạng thái like sau khi thực hiện
 *                 totalLikes:
 *                   type: number
 *                   description: Tổng số lượt thích
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy bài viết hoặc người dùng
 *       500:
 *         description: Lỗi server
 */


/**
 * @swagger
 * /api/forum/Likes/{postId}:
 *   get:
 *     summary: Lấy danh sách người thích bài viết
 *     tags: [FORUM]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của bài viết
 *     responses:
 *       200:
 *         description: Danh sách người thích
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postId:
 *                   type: string
 *                   description: ID của bài viết
 *                 totalLikes:
 *                   type: number
 *                   description: Tổng số lượt thích
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID của người thích
 *                       userModel:
 *                         type: string
 *                         enum: [User, Customer]
 *                         description: Loại người dùng
 *                       fullName:
 *                         type: string
 *                         description: Tên người thích
 *                       likedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Thời gian thích
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */
