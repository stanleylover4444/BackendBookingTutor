import express from "express";
import {
  getMessagesByChatRoom,
  getUserChatRooms,
  sendMessage,
} from "../controllers/chatController";

const router = express.Router();

router.get("/rooms/:userId", getUserChatRooms);
router.get("/messages/:chatRoomId", getMessagesByChatRoom);
router.post("/send-message", sendMessage);

export default router;
