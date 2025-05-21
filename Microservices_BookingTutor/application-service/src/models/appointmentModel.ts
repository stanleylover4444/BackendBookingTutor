import mongoose, { Document, Schema } from "mongoose";

interface IAppointment extends Document {
  tutorId: mongoose.Types.ObjectId; 
  studentId: mongoose.Types.ObjectId;
  status: string;
  source?: "appointment" | "requestOpen";
  price: number;
  notes?: string;
  subject: string[];
  area?: string;
  grade: string;
  location: string;
  requirements: string;
  sessionsPerWeek: number;
  studyGoal?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema: Schema = new Schema(
  {
    tutorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    source: {
      type: String,
      enum: ["appointment", "requestOpen"],
      required: false,
    },
    subject: {
      type: [String], 
      required: true,
      
    },
    price: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    grade: {
      type: String,
      required: true,
    },
    location: {
      type: String,
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
    studyGoal: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "appointments",
    strict: false,
  }
);

export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);