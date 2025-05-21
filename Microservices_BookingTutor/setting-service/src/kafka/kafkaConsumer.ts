import { Kafka } from "kafkajs";
import { sendNotification } from "../services/notificationService";


const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

export const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "send-notification", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const notificationData = JSON.parse(message.value?.toString() || "{}");
        console.log("Received notification data:", notificationData);

        await sendNotification(notificationData);
      } catch (error) {
        console.error("Error processing notification:", error);
      }
    },
  });
};