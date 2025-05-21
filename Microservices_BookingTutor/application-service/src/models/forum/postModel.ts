import mongoose, { Document, Schema, Types } from "mongoose";


interface ILike extends Document {
  post: Types.ObjectId;
  likes: Array<{
    user: Types.ObjectId;
    userModel: string;
    likedAt: Date;
  }>;
}

// Interface cho Post
interface IPost extends Document {
  content: string;
  images: string[];
  postedAt: Date;
  author: Types.ObjectId;
  authorModel: string;
  likes: number;
  comments: number;
  like?: Types.ObjectId | ILike; 
}

const postSchema: Schema = new Schema(
  {
    content: { type: String, default: "" },
    images: [{ type: String }],
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "authorModel",
    },
    authorModel: {
      type: String,
      required: true,
      enum: ["User", "Customer"],
    },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    like: { type: Schema.Types.ObjectId, ref: "Like" },
  },
  { timestamps: true, collection: "posts" }
);

export const Post = mongoose.model<IPost>("Post", postSchema);