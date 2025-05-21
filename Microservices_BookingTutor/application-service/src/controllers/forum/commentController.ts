import { Request, Response } from "express";
import { Comment } from "../../models/forum/commentMode";
import { Post } from "../../models/forum/postModel";
import mongoose, { Error } from "mongoose";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, postId, authorId, authorModel, parentId } = req.body;
    console.log("Request body:", req.body);
    // Kiểm tra các trường bắt buộc
    if (!content || !postId || !authorId || !authorModel) {
      res
        .status(400)
        .json({ message: "Thiếu content, postId, authorId hoặc authorModel" });
      return;
    }

    // Kiểm tra authorModel hợp lệ
    if (!["User", "Customer"].includes(authorModel)) {
      res
        .status(400)
        .json({ message: "authorModel phải là 'User' hoặc 'Customer'" });
      return;
    }

    // Kiểm tra ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "postId không phải ObjectId hợp lệ" });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      res.status(400).json({ message: "authorId không phải ObjectId hợp lệ" });
      return;
    }
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      res.status(400).json({ message: "parentId không phải ObjectId hợp lệ" });
      return;
    }

    // Tạo comment mới
    const newComment = await Comment.create({
      content,
      post: postId,
      author: authorId,
      authorModel, // Lưu authorModel
      parent: parentId || null,
    });

    // Tăng số lượng comment trong post
    await Post.findByIdAndUpdate(postId, {
      $inc: { comments: 1 },
    });

    console.log("Bình luận mới đã được tạo:", newComment);

    res.status(201).json(newComment);
    return;
  } catch (err: any) {
    console.error("Lỗi trong createComment:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
    return;
  }
};

export const replyToComment = async (req: Request, res: Response) => {
  try {
    const { content, postId, authorId, parentId } = req.body;

    if (!content || !postId || !authorId || !parentId) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Tạo comment mới trả lời
    const replyComment = await Comment.create({
      content,
      post: postId,
      author: authorId,
      parent: parentId,
    });

    // Tăng số lượng comment trong post
    await Post.findByIdAndUpdate(postId, {
      $inc: { comments: 1 },
    });

    res.status(201).json(replyComment);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
    return;
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { include } = req.query;

    if (!postId) {
       res.status(400).json({ message: "Post ID là bắt buộc" });return
    }

    let commentsQuery = Comment.find({ post: postId });

    // Xử lý include
    if (include) {
      let includes: string[] = [];
      if (typeof include === 'string') {
        includes = include.split(',');
      } else if (Array.isArray(include)) {
        includes = include.map(String);
      }

      if (includes.includes('author')) {
        commentsQuery = commentsQuery.populate({
          path: 'author',
          select: 'fullName _id',
        });
      }

      if (includes.includes('parent')) {
        commentsQuery = commentsQuery.populate({
          path: 'parent',
          select: 'content _id',
        });
      }
    }

    const comments = await commentsQuery.sort({ createdAt: -1 }).exec();

    // Log debug
    comments.forEach(comment => {
      if (!comment.author) {
        console.log(`Comment ${comment._id} has null author, authorModel: ${comment.authorModel}`);
      }
    });

    res.status(200).json(comments);
  } catch (err : any) {
    console.error('Lỗi trong getComments:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId, content } = req.body;

    if (!commentId || !content) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId, postId } = req.body;

    if (!commentId || !postId) {
      res.status(400).json({ message: "Missing required fields" });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      res.status(404).json({ message: "Comment not found" });
    }

    await Post.findByIdAndUpdate(postId, {
      $inc: { comments: -1 },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
