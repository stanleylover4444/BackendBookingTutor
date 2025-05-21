import express from "express";
import {
  createComment,
  replyToComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/forum/commentController";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/forum/postController";
import { handleImageUpload } from "../middleware/uploadMiddleware";
import { getLikes, toggleLike } from "../controllers/forum/likeController";

const postRouters = express.Router();

postRouters.post("/posts", handleImageUpload, createPost);
postRouters.get("/posts", getPosts);
postRouters.get("/posts/:id", getPostById);
postRouters.put("/posts/:id", updatePost);
postRouters.delete("/posts/:id", deletePost);

postRouters.post("/comments", createComment);
postRouters.post("/comments/reply", replyToComment);
postRouters.get("/comments/:postId", getComments);
postRouters.put("/comments", updateComment);
postRouters.delete("/comments", deleteComment);

postRouters.post("/toggleLike", toggleLike);
postRouters.get("/Likes/:postId", getLikes);
// postRouters.get("/check", checkUserLiked);

export default postRouters;
