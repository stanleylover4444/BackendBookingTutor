import express from "express";
import {
  getStatsAppointments,
  getStatsCustomers,
  getStatsUsers,
} from "../controllers/statsController";

const router = express.Router();

router.get("/users", getStatsUsers);
router.get("/customers", getStatsCustomers);
router.get("/appointments", getStatsAppointments);

export default router;
