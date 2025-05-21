import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

export const sendToQueue = async (queue: string, message: any) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`📤 Sent to queue "${queue}":`, message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("❌ RabbitMQ Error:", error);
  }
};
