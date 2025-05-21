import { Channel } from "amqplib";
import { updateUser } from "../services/userService";

export const listenUserUpdates = async (channel: Channel) => {
  const queue = "user_updates";
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg : any) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log("📥 Received user update:", data);

      await updateUser(data);
      channel.ack(msg);
    }
  });

  console.log(`✅ Listening for messages on ${queue}...`);
};
