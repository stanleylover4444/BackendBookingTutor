import {
  createRequestOpen,
  deleteRequestOpen,
  getRequestOpen,
  updateRequestOpen,
} from "../controllers/requestOpenController";
import express from "express";

const requestOpenRoutes = express.Router();

requestOpenRoutes.get("/", getRequestOpen);
requestOpenRoutes.post("/", createRequestOpen);
requestOpenRoutes.put("/:id",updateRequestOpen );
requestOpenRoutes.delete("/:id", deleteRequestOpen);



export default requestOpenRoutes;
