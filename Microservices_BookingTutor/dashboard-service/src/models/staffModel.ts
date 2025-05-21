import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff"], required: true },
    name: { type: String, required: true }, 
    phone: { type: String, required: true, unique: true }, 
    dob: { type: Date }, 
    avatar: { type: String }, 
  },
  { timestamps: true, strict: false }
);

export const Staff = mongoose.model("staff", StaffSchema);
