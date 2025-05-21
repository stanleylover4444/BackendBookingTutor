import { Request, Response } from "express";
import axios from "axios";
import { config } from "../config/dotenvConfig";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return
    }

    const response = await axios.post(`${API_URL}?key=${config.apiKey}`, {
      contents: [{ parts: [{ text }] }],
    });

    const generatedText =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      res.status(500).json({ error: "No content generated" });
      return
    }

    res.json({ text: generatedText });
  } catch (error: any) {
    console.error(
      "Error calling Gemini API:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate content" });
  }
};
