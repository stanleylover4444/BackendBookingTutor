import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Booking Tutor API Gateway",
      version: "1.0.0",
      description: "API Gateway for Booking Tutor Microservices",
    },
    servers: [
      { url: "http://localhost:5000" }, // API Gateway URL
    ],
  },
  apis: ["./src/routes/*.ts"], // Chỉ lấy API từ API Gateway
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/Swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger UI available at http://localhost:5000/Swagger");
};
