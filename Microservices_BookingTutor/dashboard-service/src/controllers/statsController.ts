import { Request, Response } from "express";
import axios from "axios";

const APPLICATION_SERVICE_URL = "http://application-service:3001";

export const getStatsUsers = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${APPLICATION_SERVICE_URL}/users`);
    res.json(response.data);
  } catch (error: any) {
    console.error("❌ Lỗi lấy danh sách users:", error.message);
    res.status(500).json({
      error: "Không thể lấy danh sách users từ Application Service",
    });
  }
};

export const getStatsCustomers = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${APPLICATION_SERVICE_URL}/customers`);
    res.json(response.data);
  } catch (error: any) {
    console.error("❌ Lỗi lấy danh sách customers:", error.message);
    res.status(500).json({
      error: "Không thể lấy danh sách customers từ Application Service",
    });
  }
};

export const getStatsAppointments = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${APPLICATION_SERVICE_URL}/appointments`);
    res.json(response.data);
  } catch (error: any) {
    console.error("❌ Lỗi lấy danh sách appointments:", error.message);
    res.status(500).json({
      error: "Không thể lấy danh sách appointments từ Application Service",
    });
  }
};
