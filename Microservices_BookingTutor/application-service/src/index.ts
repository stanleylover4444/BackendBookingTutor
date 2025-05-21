import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary"; // Thêm import cloudinary

import connectDB from "./config/db";
import { connectKafkaProducer } from "./kafka/kafkaProducer";

// Route imports
import tokenUserRoutes from "./routers/tokenRoutes";
import authRouters from "./routers/authRoutes";
import userRoutes from "./routers/userRoutes";
import customerRoutes from "./routers/customerRoutes";
import requestOpenRoutes from "./routers/requestOpenRoutes";
import appointmentRoutes from "./routers/appointmentRoutes";
import postRouters from "./routers/forumRouters";

dotenv.config();

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Missing Cloudinary environment variables");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();
const PORT = process.env.PORT || 3001;

connectDB("BookingTutor");
connectKafkaProducer();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/token", tokenUserRoutes);
app.use("/auth", authRouters);
app.use("/users", userRoutes);
app.use("/customers", customerRoutes);
app.use("/requestOpen", requestOpenRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/forums", postRouters);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

});


export default app;