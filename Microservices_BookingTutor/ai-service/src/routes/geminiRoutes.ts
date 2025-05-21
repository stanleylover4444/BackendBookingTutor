import express from "express";
import { generateContent } from "../controllers/geminiController";


const router = express.Router();

router.post("/", generateContent);

export default router;
