import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db";
import chatRoutes from "./routes/chatRoutes";
import { setupChatSocket } from "./sockets/chatSocket";
import { initSocket } from "./sockets/socket";
import { startKafkaConsumer } from "./kafka/kafkaConsumer";
import { connectKafkaProducer } from "./kafka/kafkaProducer";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
  transports: ["polling", "websocket"],
});

connectDB("AppChat");
connectKafkaProducer();
startKafkaConsumer();

initSocket(io);
setupChatSocket(io);

app.use(express.json());
app.use("/chat", chatRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({ error: "Internal Server Error" });
});

server.listen(3006, "0.0.0.0", () => {
  console.log("🚀 Chat service running on port 3006");
});

// server.listen(3006, () => {
//   console.log("🚀 Chat service running on port 3006");
// });
