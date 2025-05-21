import express from "express";

import { findProfileByToken } from "../controllers/tokenController";
import authMiddleware from "../middleware/authMiddleware";

const tokenRoutes = express.Router();


tokenRoutes.get("/", authMiddleware, findProfileByToken);


export default tokenRoutes;
