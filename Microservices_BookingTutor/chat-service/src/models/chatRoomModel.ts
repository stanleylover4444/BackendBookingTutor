import mongoose, { Document, Schema } from "mongoose";

export interface IChatRoom extends Document {
  customer: {
    _id: mongoose.Types.ObjectId;
    fullName: string;
  };
  user: {
    _id: mongoose.Types.ObjectId;
    fullName: string;
  };
  lastMessage?: {
    sender: mongoose.Types.ObjectId;
    text: string;
  };
  appointmentId?: mongoose.Types.ObjectId;
}

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    customer: {
      _id: { type: Schema.Types.ObjectId, required: true },
      fullName: { type: String, required: true },
    },
    user: {
      _id: { type: Schema.Types.ObjectId, required: true },
      fullName: { type: String, required: true },
    },
    lastMessage: {
      sender: { type: Schema.Types.ObjectId },
      text: { type: String, trim: true },
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

ChatRoomSchema.index({ "customer._id": 1, "user._id": 1 });

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
