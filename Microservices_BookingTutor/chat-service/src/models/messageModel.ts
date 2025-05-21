import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  chatRoomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chatRoomId: { type: Schema.Types.ObjectId, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Index để hỗ trợ tìm theo phòng và thời gian gửi
MessageSchema.index({ chatRoomId: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
