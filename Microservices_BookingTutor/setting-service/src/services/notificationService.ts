import admin from "firebase-admin";
import { Installation } from "../models/installationModel";

export const getDeviceTokenByReceiverId = async (
  receiverId: string
): Promise<string[]> => {
  const installation = await Installation.findOne({ idUsers: receiverId });

  if (!installation || installation.deviceToken.length === 0) {
    console.warn(`No deviceToken found for user: ${receiverId}`);
    return [];
  }

  return installation.deviceToken.map((dt) => dt.token);
};

export const sendNotification = async (data: {
  receiverId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) => {
  const { receiverId, title, body, data: additionalData } = data;

  if (!receiverId || !title || !body) {
    throw new Error("Missing required fields: receiverId, title, or body");
  }

  const tokens = await getDeviceTokenByReceiverId(receiverId);

  if (tokens.length === 0) {
    throw new Error(`No device tokens found for receiverId: ${receiverId}`);
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: additionalData || {},
    android: {
      priority: "high" as "high",
      notification: {
        channelId: "video_call_channel",  
        sound: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body,
          },
          sound: "default",
          contentAvailable: true,
        },
      },
    },
    tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("tokensssss", tokens);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error: any) {
    console.error("Error sending notification:", error);
    throw new Error(error.message || "Unknown error");
  }
};
