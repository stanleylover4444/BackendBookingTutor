import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

export const connectKafkaProducer = async () => {
  await producer.connect();
};

export const sendNotification = async (data: any) => {
  try {
    await producer.send({
      topic: 'send-notification',
      messages: [
        { value: JSON.stringify(data) },
      ],
    });
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};
