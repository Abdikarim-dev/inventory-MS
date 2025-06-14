// src/config/db.ts
import mongoose from "mongoose"
import dotenv from "dotenv"
// Load environment variables
dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log("MongoDB connected")
  } catch (err) {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  }
}
