import mongoose, { Document, Schema } from "mongoose";
interface ICustomers extends Document {
  username: string;
  fullName: string;
  phoneNumber: string;
  typeCustomer: String;
  email: string;
  password: string;
  dob?: Date;
  avatar?: string;
  active: boolean;
  balance?: string;
}

const customerSchema: Schema = new Schema(
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
    },
    dob: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    balance: {
      type: String,
    },
    typeCustomer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "customers", strict: false }
);

export const Customer = mongoose.model<ICustomers>("Customer", customerSchema);
