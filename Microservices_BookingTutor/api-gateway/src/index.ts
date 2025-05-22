import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { setupSwagger } from "./config/swagger";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.url}`);
  next();
});

const services = {
  application: "http://application-service:3001",
  ai: "http://ai-service:3005",
  dashboard: "http://dashboard-service:4000",
  chat: "http://chat-service:3006",
  setting : "http://setting-service:8000"
};

const proxyOptions = (serviceUrl: string, pathPrefix: string) => ({
  target: serviceUrl,
  changeOrigin: false,
  logLevel: "debug",
  ws: true,
  pathRewrite: { [`^/${pathPrefix}`]: "" },
  on: {
    proxyReq: (proxyReq: any, req: any, res: any) => {
      console.log(`[Proxy Request] ${req.method} ${req.url} => ${serviceUrl}${req.url}`);
      if (req.url.includes("/socket.io/")) {
        proxyReq.setHeader("Connection", "keep-alive");
        proxyReq.setHeader("Upgrade", "websocket");
      }
    },
    proxyRes: (proxyRes: any, req: any, res: any) => {
      console.log(
        `[Proxy Response] ${req.method} ${req.url} from ${serviceUrl} => ${proxyRes.statusCode}`
      );
    },
    error: (err: any, req: any, res: any) => {
      console.error(`[Proxy Error] ${req.method} ${req.url} -> ${serviceUrl}`, err);
    
      if (res && res.writeHead && res.end) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Proxy failed" }));
      } else {
        console.warn("⚠️ Unable to respond to client – response object not available.");
      }
    },
    
  },
});

app.use(
  "/api",
  createProxyMiddleware(proxyOptions(services.application, "api"))
);
app.use(
  "/serviceAI",
  createProxyMiddleware(proxyOptions(services.ai, "serviceAI"))
);
app.use(
  "/dashboard",
  createProxyMiddleware(proxyOptions(services.dashboard, "dashboard"))
);
app.use(
  "/socketChat",
  createProxyMiddleware(proxyOptions(services.chat, "socketChat"))
);

app.use(
  "/setting",
  createProxyMiddleware(proxyOptions(services.setting, "setting"))
);

app.use("/socket.io", (req, res) => {
  res.status(404).json({ error: "Invalid Socket.IO endpoint. Use /socketChat/socket.io/" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);

app.listen(5000, () => {
  console.log("🚀 API Gateway running on port 5000");
});
