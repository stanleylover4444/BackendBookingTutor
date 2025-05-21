import { Request, Response } from "express";
import { Post } from "../../models/forum/postModel";
import mongoose from "mongoose";
import { Like } from "../../models/forum/likeModel";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../models/userModel";
import { Customer } from "../../models/customerModel";

// export const createPost = async (req: Request, res: Response) => {
//   try {
//     console.log("Request body:", req.body);
//     console.log("Files:", req.files);

//     // Log cấu hình Cloudinary
//     console.log("Cloudinary config check:", {
//       cloud_name: cloudinary.config().cloud_name,
//       api_key: cloudinary.config().api_key,
//       api_secret: cloudinary.config().api_secret ? "[HIDDEN]" : undefined,
//     });

//     const { content, author, authorModel } = req.body;

//     // Kiểm tra các trường bắt buộc
//     if (!content || !author || !authorModel) {
//       res
//         .status(400)
//         .json({ message: "Thiếu content, author hoặc authorModel" });
//       return;
//     }

//     // Kiểm tra authorModel hợp lệ
//     if (!["User", "Customer"].includes(authorModel)) {
//       res
//         .status(400)
//         .json({ message: "authorModel phải là 'User' hoặc 'Customer'" });
//       return;
//     }

//     // Kiểm tra author là ObjectId hợp lệ
//     if (!mongoose.Types.ObjectId.isValid(author)) {
//       res.status(400).json({ message: "author không phải là ObjectId hợp lệ" });
//       return;
//     }

//     let uploadedImages: string[] = [];

//     if (req.files && Array.isArray(req.files) && req.files.length > 0) {
//       const files = req.files as Express.Multer.File[];

//       const uploadPromises = files.map(async (file) => {
//         const base64Data = `data:${file.mimetype};base64,${file.buffer.toString(
//           "base64"
//         )}`;

//         try {
//           const result = await cloudinary.uploader.upload(base64Data, {
//             folder: "posts",
//             resource_type: "auto",
//           });

//           console.log("Upload thành công:", result.secure_url);
//           return result.secure_url;
//         } catch (uploadError: any) {
//           console.error("Lỗi upload Cloudinary:", {
//             message: uploadError.message,
//             stack: uploadError.stack,
//           });
//           throw uploadError;
//         }
//       });

//       uploadedImages = await Promise.all(uploadPromises);
//     }

//     // Sử dụng session để đảm bảo tính nhất quán
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Tạo bài đăng mới
//       const newPost = await Post.create(
//         [
//           {
//             content,
//             images: uploadedImages,
//             author,
//             authorModel,
//             postedAt: new Date(),
//             likes: 0, // Khởi tạo với 0 like
//             comments: 0,
//           },
//         ],
//         { session }
//       );

//       // Tạo document Like cho bài đăng mới
//       const newLike = await Like.create(
//         [
//           {
//             post: newPost[0]._id, // Lấy ID của bài post vừa tạo
//             likes: [], // Khởi tạo với mảng rỗng
//           },
//         ],
//         { session }
//       );

//       // Cập nhật Post để gán ID của Like
//       await Post.updateOne(
//         { _id: newPost[0]._id },
//         { $set: { like: newLike[0]._id } },
//         { session }
//       );

//       // Commit transaction
//       await session.commitTransaction();
//       session.endSession();

//       console.log("Bài đăng mới đã được tạo:", newPost[0]);
//       console.log("Document like đã được khởi tạo và liên kết với bài đăng");

//       // Lấy lại post với thông tin Like để trả về
//       const postWithLike = await Post.findById(newPost[0]._id).populate("like");
//       res.status(201).json(postWithLike);
//     } catch (transactionError: any) {
//       // Rollback nếu có lỗi
//       await session.abortTransaction();
//       session.endSession();
//       throw transactionError;
//     }
//   } catch (err: any) {
//     console.error("Lỗi trong createPost:", err);
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };

export const createPost = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);

    const { content, imgUrl, author, authorModel } = req.body;

    if (!content && !imgUrl) {
      res.status(400).json({ message: "Phải cung cấp ít nhất content hoặc imgUrl" });
      return;
    }

    if (!author || !authorModel) {
      res.status(400).json({ message: "Thiếu author hoặc authorModel" });
      return;
    }

    if (!["User", "Customer"].includes(authorModel)) {
      res.status(400).json({ message: "authorModel phải là 'User' hoặc 'Customer'" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(author)) {
      res.status(400).json({ message: "author không phải là ObjectId hợp lệ" });
      return;
    }

    const images: string[] = imgUrl ? [imgUrl] : [];
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Tạo bài đăng mới
      const newPost = await Post.create(
        [
          {
            content: content || "",
            images,
            author,
            authorModel,
            postedAt: new Date(),
            likes: 0,
            comments: 0,
          },
        ],
        { session }
      );

      const newLike = await Like.create(
        [
          {
            post: newPost[0]._id,
            likes: [],
          },
        ],
        { session }
      );


      await Post.updateOne(
        { _id: newPost[0]._id },
        { $set: { like: newLike[0]._id } },
        { session }
      );

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      console.log("Bài đăng mới đã được tạo:", newPost[0]);
      console.log("Document like đã được khởi tạo và liên kết với bài đăng");

      // Lấy lại post với thông tin Like để trả về
      const postWithLike = await Post.findById(newPost[0]._id).populate("like");
      res.status(201).json(postWithLike);
    } catch (transactionError: any) {
      await session.abortTransaction();
      session.endSession();
      throw transactionError;
    }
  } catch (err: any) {
    console.error("Lỗi trong createPost:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { include, filter } = req.query;
    let postsQuery = Post.find();

    if (include) {
      let includes: string[] = [];
      if (typeof include === "string") {
        includes = include.split(",");
      } else if (Array.isArray(include)) {
        includes = include.map(String);
      }

      if (includes.includes("author")) {
        postsQuery = postsQuery.populate({
          path: "author",
          select: "fullName _id",
        });
      }

      if (includes.includes("like")) {
        postsQuery = postsQuery.populate({
          path: "like",
          select: "likes",
        });
      }
    }

    if (filter) {
      const filterObj =
        typeof filter === "string" ? JSON.parse(filter) : filter;
      if (filterObj.where) {
        postsQuery = postsQuery.find(filterObj.where);
      }
      if (filterObj.limit) {
        postsQuery = postsQuery.limit(Number(filterObj.limit));
      }
      if (filterObj.skip) {
        postsQuery = postsQuery.skip(Number(filterObj.skip));
      }
    }

    const posts: any = await postsQuery.sort({ createdAt: -1 }).exec();

    const userId = req.user?._id;
    const formattedPosts = posts.map((post: any) => {
      const postObj: any = post.toObject();

      if (post.like && Array.isArray(post.like.likes)) {
        postObj.like = {
          _id: post.like._id,
          likes: post.like.likes.map((like: any) => like.user.toString()),
        };
      }

      if (post.like && "likes" in post.like && userId) {
        const likeDoc = post.like as any;
        postObj.isLiked = likeDoc.likes.some((like: any) =>
          like.equals(userId)
        );
        postObj.likeCount = likeDoc.likes.length;
      } else {
        postObj.isLiked = false;
        postObj.likeCount = post.likes || 0;
      }

      return postObj;
    });

    res.status(200).json(formattedPosts);
  } catch (err: any) {
    console.error("Lỗi server:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, images } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid post id" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { content, images },
      { new: true }
    );

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid post id" });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
