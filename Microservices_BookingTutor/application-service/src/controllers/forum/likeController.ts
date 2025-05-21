import { Request, Response } from "express";
import { Customer } from "../../models/customerModel";
import { Like } from "../../models/forum/likeModel";
import { Post } from "../../models/forum/postModel";
import { User } from "../../models/userModel";
import mongoose from "mongoose";

// Thêm hoặc xóa like
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { postId, userId, userModel } = req.body;

    // Validate input
    if (!postId || !userId || !userModel) {
      res.status(400).json({ message: "Thiếu postId, userId hoặc userModel" });
      return;
    }

    // Kiểm tra userModel hợp lệ
    if (!["User", "Customer"].includes(userModel)) {
      res
        .status(400)
        .json({ message: "userModel phải là 'User' hoặc 'Customer'" });
      return;
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Không tìm thấy bài viết" });
      return;
    }

    // Kiểm tra user hoặc customer tồn tại
    let userExists;
    if (userModel === "User") {
      userExists = await User.findById(userId);
    } else {
      userExists = await Customer.findById(userId);
    }

    if (!userExists) {
      res.status(404).json({ message: `Không tìm thấy ${userModel}` });
      return;
    }

    // Tìm document like cho bài viết này
    let likeDoc = await Like.findOne({ post: postId });

    // Nếu chưa có document like cho bài viết, tạo mới
    if (!likeDoc) {
      likeDoc = new Like({
        post: postId,
        likes: [],
      });
    }

    // Kiểm tra xem người dùng đã like chưa
    const likeIndex = likeDoc.likes.findIndex(
      (like) => like.user.toString() === userId && like.userModel === userModel
    );

    // Toggle like
    if (likeIndex > -1) {
      // Nếu đã like, xóa like
      likeDoc.likes.splice(likeIndex, 1);
      await post.updateOne({ $inc: { likes: -1 } });
    } else {
      // Nếu chưa like, thêm like
      likeDoc.likes.push({
        user: new mongoose.Types.ObjectId(userId),
        userModel,
        likedAt: new Date(),
      });
      await post.updateOne({ $inc: { likes: 1 } });
    }

    // Lưu thay đổi
    await likeDoc.save();

    // Lấy số lượng like cập nhật
    const updatedPost = await Post.findById(postId);

    res.status(200).json({
      message: likeIndex > -1 ? "Đã bỏ like" : "Đã like thành công",
      liked: likeIndex <= -1,
      totalLikes: updatedPost?.likes || 0,
    });
    return;
  } catch (err: any) {
    console.error("Lỗi trong toggleLike:", err);
    if (err.code === 11000) {
      res.status(400).json({ message: "Người dùng đã like bài viết này" });
      return;
    }
    res.status(500).json({ message: "Lỗi server", error: err.message });
    return;
  }
};

export const getLikes = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Không tìm thấy bài viết" });
      return;
    }

    // Lấy document like của bài viết
    const likeDoc = await Like.findOne({ post: postId });

    if (!likeDoc || likeDoc.likes.length === 0) {
      res.status(200).json({
        postId,
        totalLikes: 0,
        likes: [],
      });
      return;
    }

    const likeDetails = [];

    for (const like of likeDoc.likes) {
      let userInfo;

      if (like.userModel === "User") {
        userInfo = await User.findById(like.user).select("fullName");
      } else {
        userInfo = await Customer.findById(like.user).select("fullName");
      }

      if (userInfo) {
        likeDetails.push({
          _id: like.user,
          userModel: like.userModel,
          fullName: userInfo.fullName,
          //   avatar: userInfo.avatar,
          likedAt: like.likedAt,
        });
      }
    }

    res.status(200).json({
      postId,
      totalLikes: likeDetails.length,
      likes: likeDetails,
    });
    return;
  } catch (err: any) {
    console.error("Lỗi trong getLikes:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
    return;
  }
};

// // Kiểm tra xem một người dùng đã like bài viết chưa
// export const checkUserLiked = async (req: Request, res: Response) => {
//   try {
//     const { postId, userId, userModel } = req.query;

//     if (!postId || !userId || !userModel) {
//       return res
//         .status(400)
//         .json({ message: "Thiếu postId, userId hoặc userModel" });
//     }

//     // Kiểm tra userModel hợp lệ
//     if (!["User", "Customer"].includes(userModel as string)) {
//       return res
//         .status(400)
//         .json({ message: "userModel phải là 'User' hoặc 'Customer'" });
//     }

//     // Kiểm tra bài viết tồn tại
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Không tìm thấy bài viết" });
//     }

//     // Kiểm tra người dùng đã like chưa
//     const likeDoc = await Like.findOne({
//       post: postId,
//       likes: {
//         $elemMatch: {
//           user: userId,
//           userModel: userModel,
//         },
//       },
//     });

//     return res.status(200).json({
//       liked: !!likeDoc,
//       totalLikes: post.likes,
//     });
//   } catch (err: any) {
//     console.error("Lỗi trong checkUserLiked:", err);
//     return res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };
