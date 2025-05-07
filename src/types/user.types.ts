import type { Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  phone?: string
  username: string
  password: string
  role: "admin" | "staff"
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
