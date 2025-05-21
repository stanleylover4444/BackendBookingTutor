import mongoose, { Document, Schema, Types } from "mongoose";

interface ILike extends Document {
  post: Types.ObjectId;
  likes: Array<{
    user: Types.ObjectId;
    userModel: string;
    likedAt: Date;
  }>;
}

const likeSchema: Schema = new Schema(
  {
    post: { 
      type: Schema.Types.ObjectId, 
      ref: "Post", 
      required: true,
      unique: true 
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          required: true,
          refPath: "likes.userModel" 
        },
        userModel: {
          type: String,
          required: true,
          enum: ["User", "Customer"]
        },
        likedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true, collection: "likes" }
);

// Tạo compound index để đảm bảo mỗi người dùng chỉ like một lần
likeSchema.index({ "post": 1, "likes.user": 1, "likes.userModel": 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", likeSchema);