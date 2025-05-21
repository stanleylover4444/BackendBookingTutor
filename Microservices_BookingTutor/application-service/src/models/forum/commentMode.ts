import mongoose, { Document, Schema, Types } from "mongoose";

interface IComment extends Document {
  content: string;
  post: Types.ObjectId;
  author: Types.ObjectId;
  authorModel: string; // Thêm trường để xác định User hoặc Customer
  parent?: Types.ObjectId | null;
}

const commentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "authorModel", // Tham chiếu động dựa trên authorModel
    },
    authorModel: {
      type: String,
      required: true,
      enum: ["User", "Customer"], // Chỉ cho phép User hoặc Customer
    },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true, collection: "comments" }
);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);