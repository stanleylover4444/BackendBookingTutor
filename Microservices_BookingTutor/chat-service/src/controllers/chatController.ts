import { Request, Response } from "express";
import { ChatRoom } from "../models/chatRoomModel";
import { Message } from "../models/messageModel";
import { getIO } from "../sockets/socket";
import { emitRoomUpdated } from "../sockets/chatSocket";
import { sendNotification } from "../kafka/kafkaProducer";
import mongoose from "mongoose";

export const getUserChatRooms = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { roomId, customerId, userId: queryUserId, appointmentId } = req.query;

  // Kiểm tra userId từ params
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ error: "Invalid userId" });
    return;
  }

  try {
    // Xây dựng điều kiện lọc
    const filter: any = {};

    // Nếu có roomId, thêm vào filter
    if (roomId && mongoose.Types.ObjectId.isValid(roomId as string)) {
      filter._id = new mongoose.Types.ObjectId(roomId as string);
    } else if (roomId) {
      res.status(400).json({ error: "Invalid roomId" });
      return;
    }

    // Nếu có customerId, thêm vào filter
    if (customerId && mongoose.Types.ObjectId.isValid(customerId as string)) {
      filter["customer._id"] = new mongoose.Types.ObjectId(
        customerId as string
      );
    } else if (customerId) {
      res.status(400).json({ error: "Invalid customerId" });
      return;
    }

    // Nếu có queryUserId, thêm vào filter
    if (queryUserId && mongoose.Types.ObjectId.isValid(queryUserId as string)) {
      filter["user._id"] = new mongoose.Types.ObjectId(queryUserId as string);
    } else if (queryUserId) {
      res.status(400).json({ error: "Invalid userId in query" });
      return;
    }

    // Nếu có appointmentId, thêm vào filter
    if (
      appointmentId &&
      mongoose.Types.ObjectId.isValid(appointmentId as string)
    ) {
      filter.appointmentId = new mongoose.Types.ObjectId(
        appointmentId as string
      );
    } else if (appointmentId) {
      res.status(400).json({ error: "Invalid appointmentId" });
      return;
    }

    // Nếu không có filter cụ thể, giữ logic cũ: tìm phòng chat mà userId là customer hoặc user
    if (Object.keys(filter).length === 0) {
      filter.$or = [
        { "customer._id": new mongoose.Types.ObjectId(userId) },
        { "user._id": new mongoose.Types.ObjectId(userId) },
      ];
    }

    // Truy vấn MongoDB với filter
    const chatRooms = await ChatRoom.find(filter).sort({ updatedAt: -1 });

    res.json(chatRooms);
  } catch (error) {
    console.error("❌ Error in getUserChatRooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesByChatRoom = async (req: Request, res: Response) => {
  try {
    const { chatRoomId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
      res.status(400).json({ error: "Invalid chatRoomId" });
      return;
    }
    const messages = await Message.find({ chatRoomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("❌ Error in getMessagesByChatRoom:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatRoomId, senderId, receiverId, message } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(chatRoomId) ||
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      res.status(400).json({ error: "Invalid IDs" });
      return;
    }

    const newMessage = new Message({
      chatRoomId,
      senderId,
      receiverId,
      message,
      createdAt: new Date(),
    });
    await newMessage.save();

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

    const io = getIO();

    io.to(chatRoomId).emit("receiveMessage", {
      newMessage: {
      _id: newMessage._id,
      chatRoomId,
      senderId,
      receiverId,
      message,
      createdAt: newMessage.createdAt,
    },
    });


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


    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server nội bộ", error });
  }
};
