import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import notificationRouter from "./routes/notification";
// import healthRouter from "./routes/health";
import { initializeFirebase } from "./config/firebase";
import { startKafkaConsumer } from "./kafka/kafkaConsumer";
import installationRouter from "./routers/installationRouter";
import connectDB from "../config/db";
import uploadImageRoute from "./routers/uploadImageController";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

initializeFirebase();

startKafkaConsumer().catch((error : any) => {
  console.error("Failed to start Kafka consumer:", error);
  process.exit(1);
});
connectDB("BookingTutor");
app.use("/installations", installationRouter);
app.use('/containers/imgs', uploadImageRoute);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});