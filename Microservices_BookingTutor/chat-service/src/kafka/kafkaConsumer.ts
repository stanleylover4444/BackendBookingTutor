import { Kafka } from 'kafkajs';
import { ChatRoom } from '../models/chatRoomModel';
import mongoose from 'mongoose';

const kafka = new Kafka({
  clientId: 'chat-service',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'chat-group' });

// export const startKafkaConsumer = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'appointment-created', fromBeginning: false });

//   await consumer.run({
//     eachMessage: async ({ topic, partition, message }) => {
//       try {
//         const payload = JSON.parse(message.value!.toString());
//         const { tutor, student, appointmentId } = payload;

//         console.log("📥 Received payload:", payload);

//         // Tìm xem đã có phòng chat giữa 2 người này chưa
//         const existingRoom = await ChatRoom.findOne({
//           "customer._id": tutor.id,
//           "user._id": student.id,
//         });

//         if (!existingRoom) {
//           const chatRoom = new ChatRoom({
//             customer: {
//               _id: tutor.id,
//               fullName: tutor.fullName,
//             },
//             user: {
//               _id: student.id,
//               fullName: student.fullName,
//             },
//             appointmentId,
//           });

//           await chatRoom.save();
//           console.log(`✅ ChatRoom created for appointment ${appointmentId}`);
//         } else {
//           console.log(`⚠️ ChatRoom already exists for tutor ${tutor.id} and student ${student.id}`);
//         }

//       } catch (err) {
//         console.error("❌ Error processing appointment-created message:", err);
//       }
//     },
//   });
// };


export const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "appointment-created", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) {
          throw new Error("Message value is null");
        }

        const payload = JSON.parse(message.value.toString());
        const { tutor, student, appointmentId } = payload;

        // Kiểm tra payload
        if (!tutor?.id || !student?.id || !appointmentId) {
          throw new Error("Payload thiếu các trường bắt buộc: tutor.id, student.id, appointmentId");
        }
        if (
          !mongoose.Types.ObjectId.isValid(tutor.id) ||
          !mongoose.Types.ObjectId.isValid(student.id) ||
          !mongoose.Types.ObjectId.isValid(appointmentId)
        ) {
          throw new Error("tutor.id, student.id hoặc appointmentId không phải là ObjectId hợp lệ");
        }

        console.log("📥 Received payload:", payload);

        // Tìm phòng chat hiện có với customer là student và user là tutor
        const existingRoom = await ChatRoom.findOne({
          "customer._id": student.id,
          "user._id": tutor.id,
        });

        if (!existingRoom) {
          // Tạo phòng chat mới
          const chatRoom = new ChatRoom({
            customer: {
              _id: new mongoose.Types.ObjectId(student.id),
              fullName: student.fullName || "Unknown Student",
            },
            user: {
              _id: new mongoose.Types.ObjectId(tutor.id),
              fullName: tutor.fullName || "Unknown Tutor",
            },
            appointmentId: new mongoose.Types.ObjectId(appointmentId),
          });

          await chatRoom.save();
          console.log(`✅ ChatRoom created for appointment ${appointmentId}`);
        } else {
          // Cập nhật appointmentId nếu chưa có
          if (!existingRoom.appointmentId) {
            existingRoom.appointmentId = new mongoose.Types.ObjectId(appointmentId);
            await existingRoom.save();
            console.log(`✅ Updated ChatRoom with appointmentId ${appointmentId}`);
          } else {
            console.log(
              `⚠️ ChatRoom already exists for student ${student.id} and tutor ${tutor.id}`
            );
          }
        }
      } catch (err: any) {
        console.error("❌ Error processing appointment-created message:", err.message || err);
        // Có thể gửi lỗi đến dead-letter queue ở đây
      }
    },
  });
};