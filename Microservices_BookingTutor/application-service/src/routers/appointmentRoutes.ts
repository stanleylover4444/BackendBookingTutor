import express from "express";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
} from "../controllers/appointmentController";

const appointmentRoutes = express.Router();

appointmentRoutes.get("/", getAppointment);
appointmentRoutes.post("/", createAppointment);
appointmentRoutes.put("/:id", updateAppointment);
appointmentRoutes.delete("/:id", deleteAppointment);

export default appointmentRoutes;
