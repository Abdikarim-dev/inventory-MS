import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
  });
};

startServer();
