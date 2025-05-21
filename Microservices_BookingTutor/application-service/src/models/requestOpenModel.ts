import mongoose, { Document, Schema } from "mongoose";

interface IRequestOpen extends Document {
  subject: string[];                     // Mảng các môn học
  grade: string;                         // Cấp lớp (tạm dùng educationLevel)
  location: string;                      // Địa điểm cụ thể
  area?: string;                         // Khu vực (tùy chọn)
  price: number;                         // Giá tiền mỗi buổi
  requirements: string;                  // Yêu cầu công việc
  sessionsPerWeek: number;               // Số buổi mỗi tuần
  gender?: string;                       // Giới tính gia sư (tùy chọn)
  status: string;                        // "waiting", "accepted", "cancelled"
  createdBy: mongoose.Types.ObjectId;    // Người tạo yêu cầu
  tutorRequests: mongoose.Types.ObjectId[]; // Danh sách ID gia sư yêu cầu
  acceptedTutor?: mongoose.Types.ObjectId;  // Gia sư được chấp nhận
  studyGoal?: string;                    // Mục tiêu học (thêm trường này)
  createdAt: Date;
  updatedAt: Date;
}

const RequestOpenSchema: Schema = new Schema(
  {
    subject: {
      type: [String],
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: false, // Tùy chọn
    },
    price: {
      type: Number,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    sessionsPerWeek: {
      type: Number,
      required: true, 
    },
    gender: {
      type: String,
      enum: ["1", "2"],
      required: false, 
    },
    status: {
      type: String,
      enum: ["waiting", "accepted", "cancelled"],
      default: "waiting",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    tutorRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    acceptedTutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    studyGoal: {
      type: String,
      required: false, 
    },
  },
  {
    timestamps: true,
    collection: "requestOpens",
    strict: false,
  }
);

export const RequestOpen = mongoose.model<IRequestOpen>("RequestOpen", RequestOpenSchema);
