import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

export const connectRabbitMQ = async () => {
  try {
    console.log(RABBITMQ_URL)
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");
    return channel;
  } catch (error) {
    console.error("❌ Error connecting to RabbitMQ:", error);
    process.exit(1);
  }
};
