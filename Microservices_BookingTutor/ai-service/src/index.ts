import express from "express";
import cors from "cors";
import { config } from "./config/dotenvConfig";
import geminiRoutes from "./routes/geminiRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/gemini", geminiRoutes);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
