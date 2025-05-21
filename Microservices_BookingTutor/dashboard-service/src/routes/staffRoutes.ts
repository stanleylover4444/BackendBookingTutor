import express from "express";
import {
  createStaff,
  getStaff,
  updateStaffInfo,
  updateStaffPassword,
} from "../controllers/staffController";

const staffRoutes = express.Router();


staffRoutes.get("/", getStaff);
staffRoutes.post("/", createStaff);
staffRoutes.put("/:staffId", updateStaffInfo);
staffRoutes.put("/:staffId/password", updateStaffPassword);
export default staffRoutes;
