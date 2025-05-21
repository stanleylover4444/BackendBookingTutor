import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'application-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
})
export const connectKafkaProducer = async () => {
  await producer.connect();
};

export const sendNotification = async (data: any) => {
  const result = await producer.send({
    topic: 'send-notification',
    messages: [{ value: JSON.stringify(data) }],
  });
  console.log('Kafka message sent', result);
};

export const sendAppointmentCreated = async (data: any) => {
  const result = await producer.send({
    topic: 'appointment-created',
    messages: [{ value: JSON.stringify(data) }],
  });
  console.log('Kafka message sent', result);
};
