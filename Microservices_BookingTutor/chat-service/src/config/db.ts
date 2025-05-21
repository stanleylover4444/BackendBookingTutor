import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (dbName: string) => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const mongoUri = `${process.env.MONGO_URI}${dbName}`;
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected to ${dbName} database`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
