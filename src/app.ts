import express from "express";
import cors from "cors";

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from "./config/swagger";
import swaggerJsDoc from 'swagger-jsdoc';
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Define AppError interface
interface AppError extends Error {
  statusCode?: number;
}

// Global Error Handler
const globalErrorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    statusCode: err.statusCode || 500,
    message: err.message
  });
  next(); // Call next to ensure proper middleware chain completion
};

// Use the middleware
app.use(globalErrorHandler);

export default app;
