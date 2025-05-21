import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  yearOfExperience?: number;
  dob?: Date;
  educationLevel: string;
  password: string;
  avatar?: string;
  active: boolean;
  address?: string;
  subjects: string[];
  rejectedRequestOpens?: mongoose.Types.ObjectId[]; 
  appliedRequestOpens?: mongoose.Types.ObjectId[]; 
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      default: "",
    },
    yearOfExperience: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
   
    subjects: {
      type: [String],
      default: [],
    },
    rejectedRequestOpens: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'RequestOpen', 
      default: [] 
    }],
    appliedRequestOpens: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'RequestOpen', 
      default: [] 
    }],
  },
  { timestamps: true, collection: "users", strict: false }
);

export const User = mongoose.model<IUser>("User", userSchema);