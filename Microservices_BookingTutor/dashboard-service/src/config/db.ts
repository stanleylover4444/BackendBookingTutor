import mongoose from "mongoose";

const connectDB = async (dbName: string) => {
  try {
    const mongoUri = `${process.env.MONGO_URI}${dbName}`;
    await mongoose.connect(mongoUri);
    console.log(`MongoDB connected to ${dbName} database`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
