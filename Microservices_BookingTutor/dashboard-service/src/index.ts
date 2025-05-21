import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import statsRoutes from "./routes/statsRoutes";
// import staffRoutes from "./routes/staffRoutes";
import { connectRabbitMQ } from "./config/rabbitmq";
import { listenUserUpdates } from "./consumers/userConsumer";
import staffRoutes from "./routes/staffRoutes";
import tokenRoutes from "./routes/tokenRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/token", tokenRoutes);
app.use("/auth", authRoutes);
app.use("/stats", statsRoutes);
app.use("/staffs", staffRoutes);

connectDB("BookingTutor-Dashboard")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// connectRabbitMQ().then((channel) => {
//   if (channel) {
//     listenUserUpdates(channel);
//     console.log("✅ Listening to user updates from RabbitMQ...");
//   } else {
//     console.warn("⚠️ Skipping RabbitMQ listener due to connection failure.");
//   }
// });
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export default app;
