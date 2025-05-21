// import mongoose from "mongoose";
// import { ChatRoom } from "../models/chatRoomModel";
// import { Message } from "../models/messageModel";
// import { Server, Socket } from "socket.io";
// import { sendNotification } from "../kafka/kafkaProducer";

// interface RTCSessionDescriptionInit {
//     type: 'offer' | 'answer';
//     sdp?: string;
// }

// interface RTCIceCandidateInit {
//     candidate: string;
//     sdpMid?: string | null;
//     sdpMLineIndex?: number | null;
// }

// interface ServerToClientEvents {
//     messageHistory: (messages: any[]) => void;
//     receiveMessage: (message: any) => void;
//     roomCreated: (room: any) => void;
//     roomUpdated: (room: any) => void;
//     roomDeleted: (roomId: string) => void;
//     roomList: (rooms: any[]) => void;
//     error: (err: { message: string }) => void;
//     receiveOffer: (data: { senderId: string; offer: RTCSessionDescriptionInit }) => void;
//     receiveAnswer: (data: { answer: RTCSessionDescriptionInit }) => void;
//     receiveIceCandidate: (data: { candidate: RTCIceCandidateInit }) => void;
//     receiveCallRequest: (data: { callerId: string; chatRoomId: string }) => void;
// }

// interface ClientToServerEvents {
//     joinRoom: (data: { chatRoomId: string; senderId: string }) => void;
//     sendMessage: (data: {
//         chatRoomId: string;
//         senderId: string;
//         receiverId: string;
//         message: string;
//     }) => void;
//     getRooms: (data: { userId: string }) => void;
//     sendOffer: (data: { chatRoomId: string; offer: RTCSessionDescriptionInit }) => void;
//     sendAnswer: (data: { chatRoomId: string; answer: RTCSessionDescriptionInit }) => void;
//     sendIceCandidate: (data: { chatRoomId: string; candidate: RTCIceCandidateInit }) => void;
//     sendCallRequest: (data: { chatRoomId: string; receiverId: string }) => void;
// }

// // Lưu trữ ánh xạ userId -> socketId
// const userSocketMap: { [userId: string]: string } = {};

// export const setupChatSocket = (
//     io: Server<ClientToServerEvents, ServerToClientEvents>
// ) => {
//     io.on(
//         "connection",
//         (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
//             console.log(`Socket đã kết nối: ${socket.id}`);

//             socket.on("joinRoom", async ({ chatRoomId, senderId }) => {
//                 try {
//                     console.log(`Người dùng ${senderId} tham gia phòng ${chatRoomId}`);
//                     if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
//                         throw new Error("Invalid chatRoomId");
//                     }
//                     socket.join(chatRoomId);
//                     // Lưu ánh xạ userId -> socketId
//                     userSocketMap[senderId] = socket.id;
//                     console.log(`Updated userSocketMap:`, userSocketMap);

//                     const messages = await Message.find({ chatRoomId }).sort({
//                         createdAt: 1,
//                     });
//                     socket.emit("messageHistory", messages);
//                 } catch (err: any) {
//                     console.error(
//                         `Lỗi khi tham gia phòng ${chatRoomId}:`,
//                         err.message || err
//                     );
//                     socket.emit("error", { message: "Không thể tải lịch sử tin nhắn" });
//                 }
//             });

//             io.on(
//                 "sendMessage",
//                 async ({ chatRoomId, senderId, receiverId, message }) => {
//                     try {
//                         console.log(
//                             `Tin nhắn từ ${senderId} trong phòng ${chatRoomId}: ${message}`
//                         );

//                         const room = await ChatRoom.findById(chatRoomId);
//                         if (!room) {
//                             throw new Error("Không tìm thấy phòng chat");
//                         }

//                         const newMessage = new Message({
//                             chatRoomId,
//                             senderId,
//                             receiverId,
//                             message,
//                             createdAt: new Date(),
//                         });
//                         await newMessage.save();

//                         socket.to(chatRoomId).emit("receiveMessage", {
//                             newMessage,
//                         });

//                         const updatedRoom = await ChatRoom.findByIdAndUpdate(
//                             chatRoomId,
//                             {
//                                 lastMessage: {
//                                     sender: new mongoose.Types.ObjectId(senderId),
//                                     text: message,
//                                 },
//                                 updatedAt: new Date(),
//                             },
//                             { new: true }
//                         );

//                         if (!updatedRoom) {
//                             throw new Error("Không tìm thấy phòng chat");
//                         }
//                         console.log(`Updated room:`, updatedRoom);

//                         socket.to(chatRoomId).emit("roomUpdated", {
//                             _id: newMessage._id,
//                             chatRoomId,
//                             senderId,
//                             receiverId,
//                             message,
//                             createdAt: newMessage.createdAt,
//                         });

//                         await sendNotification({
//                             receiverId: receiverId,
//                             title: "Gia Sư Thành Danh",
//                             body: "Bạn có 1 tin nhắn tới",
//                             data: { key: "value" },
//                         });
//                     } catch (err: any) {
//                         console.error("Lỗi gửi tin nhắn:", err.message || err);
//                         socket.emit("error", { message: "Không thể gửi tin nhắn" });
//                     }
//                 }
//             );

//             socket.on("getRooms", async ({ userId }) => {
//                 try {
//                     console.log(`Lấy danh sách phòng cho người dùng ${userId}`);
//                     const rooms = await ChatRoom.find({
//                         $or: [{ "customer._id": userId }, { "user._id": userId }],
//                     });
//                     socket.emit("roomList", rooms);
//                 } catch (err: any) {
//                     console.error("Lỗi lấy danh sách phòng:", err.message || err);
//                     socket.emit("error", { message: "Không thể lấy danh sách phòng" });
//                 }
//             });

//             socket.on("sendOffer", ({ chatRoomId, offer }) => {
//                 try {
//                     console.log(`Nhận offer từ socket ${socket.id} trong phòng ${chatRoomId}`);
//                     socket.to(chatRoomId).emit("receiveOffer", {
//                         senderId: socket.id,
//                         offer,
//                     });
//                 } catch (err: any) {
//                     console.error("Lỗi gửi offer:", err.message || err);
//                     socket.emit("error", { message: "Không thể gửi offer" });
//                 }
//             });

//             socket.on("sendAnswer", ({ chatRoomId, answer }) => {
//                 try {
//                     console.log(`Nhận answer từ socket ${socket.id} trong phòng ${chatRoomId}`);
//                     socket.to(chatRoomId).emit("receiveAnswer", {
//                         answer,
//                     });
//                 } catch (err: any) {
//                     console.error("Lỗi gửi answer:", err.message || err);
//                     socket.emit("error", { message: "Không thể gửi answer" });
//                 }
//             });

//             socket.on("sendIceCandidate", ({ chatRoomId, candidate }) => {
//                 try {
//                     console.log(`Nhận ICE candidate từ socket ${socket.id} trong phòng ${chatRoomId}`);
//                     socket.to(chatRoomId).emit("receiveIceCandidate", {
//                         candidate,
//                     });
//                 } catch (err: any) {
//                     console.error("Lỗi gửi ICE candidate:", err.message || err);
//                     socket.emit("error", { message: "Không thể gửi ICE candidate" });
//                 }
//             });

//             socket.on("sendCallRequest", ({ chatRoomId, receiverId }) => {
//                 try {
//                     console.log(`Nhận yêu cầu gọi từ socket ${socket.id} trong phòng ${chatRoomId} tới ${receiverId}`);
                   
//                     const receiverSocketId = userSocketMap[receiverId];

//                     // if (!receiverSocketId) {
//                     //     console.warn(`Người nhận ${receiverId} không có trong phòng ${chatRoomId}`);
//                     //     socket.emit("error", { message: "Người nhận không có mặt" });
//                     //     return;
//                     // }

//                    console.warn(`CCCCCC`);
//                     socket.to(chatRoomId).emit("receiveCallRequest", {
//                         callerId: socket.id,
//                         chatRoomId,
//                     });
                   
//                     sendNotification({
//                         receiverId,
//                         title: "Gia Sư Thành Danh",
//                         body: "Bạn có một cuộc gọi video đến",
//                         data: { chatRoomId ,  mode: "CallVideo" },
//                         android: {
//                             priority: 'high',
//                             notification: {
//                                 channelId: 'video_call_channel',
//                                 sound: 'default'
//                             }
//                         },
//                           apns: {
//                             payload: {
//                               aps: {
//                                 content_available: 1
//                               }
//                             }
//                           },
//                     });
//                 } catch (err: any) {
//                     console.error("Lỗi gửi yêu cầu gọi:", err.message || err);
//                     socket.emit("error", { message: "Không thể gửi yêu cầu gọi" });
//                 }
//             });

//             // Xóa ánh xạ khi socket ngắt kết nối
//             socket.on("disconnect", () => {
//                 console.log(`Socket ngắt kết nối: ${socket.id}`);
//                 for (const [userId, socketId] of Object.entries(userSocketMap)) {
//                     if (socketId === socket.id) {
//                         delete userSocketMap[userId];
//                         console.log(`Removed user ${userId} from userSocketMap`);
//                     }
//                 }
//             });
//         }
//     );
// };

// export const emitRoomCreated = async (
//     io: Server<ClientToServerEvents, ServerToClientEvents>,
//     roomId: string
// ) => {
//     try {
//         const room = await ChatRoom.findById(roomId);
//         if (!room) {
//             throw new Error("Không tìm thấy phòng");
//         }

//         io.to(room.customer._id.toString()).emit("roomCreated", room);
//         io.to(room.user._id.toString()).emit("roomCreated", room);
//     } catch (err: any) {
//         console.error("Lỗi gửi sự kiện tạo phòng:", err.message || err);
//     }
// };

// export const emitRoomUpdated = async (
//     io: Server<ClientToServerEvents, ServerToClientEvents>,
//     updatedRoom: any,
//     newMessage: any
// ) => {
//     try {
//         const { _id, chatRoomId, senderId, receiverId, message, createdAt } = newMessage;

//         io.to(chatRoomId).emit("receiveMessage", {
//             newMessage,
//         });

//         io.to(chatRoomId).emit("roomUpdated", {
//             _id,
//             chatRoomId,
//             senderId,
//             receiverId,
//             message,
//             createdAt,
//         });
//     } catch (err: any) {
//         console.error("Lỗi gửi sự kiện cập nhật phòng:", err.message || err);
//     }
// };




import mongoose from "mongoose";
import { ChatRoom } from "../models/chatRoomModel";
import { Message } from "../models/messageModel";
import { Server, Socket } from "socket.io";
import { sendNotification } from "../kafka/kafkaProducer";

interface RTCSessionDescriptionInit {
    type: 'offer' | 'answer';
    sdp?: string;
}

interface RTCIceCandidateInit {
    candidate: string;
    sdpMid?: string | null;
    sdpMLineIndex?: number | null;
}

interface ServerToClientEvents {
  messageHistory: (messages: any[]) => void;
  receiveMessage: (message: any) => void;
  roomCreated: (room: any) => void;
  roomUpdated: (room: any) => void;
  roomDeleted: (roomId: string) => void;
  roomList: (rooms: any[]) => void;
  error: (err: { message: string }) => void;
  receiveOffer: (data: { senderId: string; offer: RTCSessionDescriptionInit }) => void;
  receiveAnswer: (data: { answer: RTCSessionDescriptionInit }) => void;
  receiveIceCandidate: (data: { candidate: RTCIceCandidateInit }) => void;
  receiveCallRequest: (data: { callerId: string; chatRoomId: string }) => void;
}

interface ClientToServerEvents {
  joinRoom: (data: { chatRoomId: string; senderId: string }) => void;
  sendMessage: (data: {
    chatRoomId: string;
    senderId: string;
    receiverId: string;
    message: string;
  }) => void;
  getRooms: (data: { userId: string }) => void;
  sendOffer: (data: { chatRoomId: string; offer: RTCSessionDescriptionInit }) => void;
  sendAnswer: (data: { chatRoomId: string; answer: RTCSessionDescriptionInit }) => void;
  sendIceCandidate: (data: { chatRoomId: string; candidate: RTCIceCandidateInit }) => void;
  sendCallRequest: (data: { chatRoomId: string; receiverId: string }) => void;
}
const userSocketMap: { [userId: string]: string } = {};

export const setupChatSocket = (
  io: Server<ClientToServerEvents, ServerToClientEvents>
) => {
  io.on(
    "connection",
    (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      console.log(`Socket đã kết nối: ${socket.id}`);

      socket.on("joinRoom", async ({ chatRoomId, senderId }) => {
        try {
          console.log(`Người dùng ${senderId} tham gia phòng ${chatRoomId}`);
          if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
            throw new Error("Invalid chatRoomId");
          }
          socket.join(chatRoomId);
          const messages = await Message.find({ chatRoomId }).sort({
            createdAt: 1,
          });
          socket.emit("messageHistory", messages);
        } catch (err: any) {
          console.error(
            `Lỗi khi tham gia phòng ${chatRoomId}:`,
            err.message || err
          );
          socket.emit("error", { message: "Không thể tải lịch sử tin nhắn" });
        }
      });

      socket.on(
        "sendMessage",
        async ({ chatRoomId, senderId, receiverId, message }) => {
          try {
            console.log(
              `Tin nhắn từ ${senderId} trong phòng ${chatRoomId}: ${message}`
            );

            // Tìm phòng chat để lấy thông tin customer và user
            const room = await ChatRoom.findById(chatRoomId);
            if (!room) {
              throw new Error("Không tìm thấy phòng chat");
            }

            // Tạo tin nhắn mới
            const newMessage = new Message({
              chatRoomId,
              senderId,
              receiverId,
              message,
              createdAt: new Date(),
            });
            await newMessage.save();

            io.to(chatRoomId).emit("receiveMessage", {
              newMessage,
            });

            const updatedRoom = await ChatRoom.findByIdAndUpdate(
              chatRoomId,
              {
                lastMessage: {
                  sender: new mongoose.Types.ObjectId(senderId),
                  text: message,
                },
                updatedAt: new Date(),
              },
              { new: true }
            );

            if (!updatedRoom) {
              throw new Error("Không tìm thấy phòng chat");
            }
            console.log(updatedRoom);

            io.to(chatRoomId).emit("roomUpdated", {
              _id: newMessage._id,
              chatRoomId,
              senderId,
              receiverId,
              message,
              createdAt: newMessage.createdAt,
            });

            await sendNotification({
              receiverId : receiverId,
              title: "Gia Sư Thành Danh",
              body: "Bạn có 1 tin nhắn tới",
              data: { key: "value" },
            });
          } catch (err: any) {
            console.error("Lỗi gửi tin nhắn:", err.message || err);
            socket.emit("error", { message: "Không thể gửi tin nhắn" });
          }
        }
      );

      socket.on("getRooms", async ({ userId }) => {
        try {
          console.log(`Lấy danh sách phòng cho người dùng ${userId}`);
          const rooms = await ChatRoom.find({
            $or: [{ "customer._id": userId }, { "user._id": userId }],
          });
          socket.emit("roomList", rooms);
        } catch (err: any) {
          console.error("Lỗi lấy danh sách phòng:", err.message || err);
          socket.emit("error", { message: "Không thể lấy danh sách phòng" });
        }
      });
      socket.on("sendOffer", ({ chatRoomId, offer }) => {
        try {
            console.log(`Nhận offer từ socket ${socket.id} trong phòng ${chatRoomId}`);
            socket.to(chatRoomId).emit("receiveOffer", {
                senderId: socket.id,
                offer,
            });
        } catch (err: any) {
            console.error("Lỗi gửi offer:", err.message || err);
            socket.emit("error", { message: "Không thể gửi offer" });
        }
    });

    socket.on("sendAnswer", ({ chatRoomId, answer }) => {
        try {
            console.log(`Nhận answer từ socket ${socket.id} trong phòng ${chatRoomId}`);
            socket.to(chatRoomId).emit("receiveAnswer", {
                answer,
            });
        } catch (err: any) {
            console.error("Lỗi gửi answer:", err.message || err);
            socket.emit("error", { message: "Không thể gửi answer" });
        }
    });

    socket.on("sendIceCandidate", ({ chatRoomId, candidate }) => {
        try {
            console.log(`Nhận ICE candidate từ socket ${socket.id} trong phòng ${chatRoomId}`);
            socket.to(chatRoomId).emit("receiveIceCandidate", {
                candidate,
            });
        } catch (err: any) {
            console.error("Lỗi gửi ICE candidate:", err.message || err);
            socket.emit("error", { message: "Không thể gửi ICE candidate" });
        }
    });

    socket.on("sendCallRequest", ({ chatRoomId, receiverId }) => {
        try {
            console.log(`Nhận yêu cầu gọi từ socket ${socket.id} trong phòng ${chatRoomId} tới ${receiverId}`);
           
            const receiverSocketId = userSocketMap[receiverId];

            // if (!receiverSocketId) {
            //     console.warn(`Người nhận ${receiverId} không có trong phòng ${chatRoomId}`);
            //     socket.emit("error", { message: "Người nhận không có mặt" });
            //     return;
            // }

           console.warn(`CCCCCC`);
            socket.to(chatRoomId).emit("receiveCallRequest", {
                callerId: socket.id,
                chatRoomId,
            });
           
            sendNotification({
                receiverId,
                title: "Gia Sư Thành Danh",
                body: "Bạn có một cuộc gọi video đến",
                data: { chatRoomId ,  mode: "CallVideo" },
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'video_call_channel',
                        sound: 'default'
                    }
                },
                  apns: {
                    payload: {
                      aps: {
                        content_available: 1
                      }
                    }
                  },
            });
        } catch (err: any) {
            console.error("Lỗi gửi yêu cầu gọi:", err.message || err);
            socket.emit("error", { message: "Không thể gửi yêu cầu gọi" });
        }
    });

    // Xóa ánh xạ khi socket ngắt kết nối
    socket.on("disconnect", () => {
        console.log(`Socket ngắt kết nối: ${socket.id}`);
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId];
                console.log(`Removed user ${userId} from userSocketMap`);
            }
        }
    });
    }
  );
};

export const emitRoomCreated = async (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  roomId: string
) => {
  try {
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      throw new Error("Không tìm thấy phòng");
    }

    io.to(room.customer._id.toString()).emit("roomCreated", room);
    io.to(room.user._id.toString()).emit("roomCreated", room);
  } catch (err: any) {
    console.error("Lỗi gửi sự kiện tạo phòng:", err.message || err);
  }
};

export const emitRoomUpdated = async (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  updatedRoom: any,
  newMessage: any
) => {
  try {
    const { _id, chatRoomId, senderId, receiverId, message, createdAt } =
      newMessage;

    io.to(chatRoomId).emit("receiveMessage", {
      newMessage,
    });

    io.to(chatRoomId).emit("roomUpdated", {
      _id,
      chatRoomId,
      senderId,
      receiverId,
      message,
      createdAt,
    });
  } catch (err: any) {
    console.error("Lỗi gửi sự kiện cập nhật phòng:", err.message || err);
  }
};
