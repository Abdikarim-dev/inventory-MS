import User from "./user.model"
import bcrypt from "bcryptjs"

export const userService = {
  // Get all active users
  getAllUsers: async () => {
    return await User.find({ isDeleted: false }).select("-password").sort({ createdAt: -1 })
  },

  // Get user by ID
  getUserById: async (id: string) => {
    return await User.findOne({ _id: id, isDeleted: false }).select("-password")
  },

  // Update user role
  updateUserRole: async (id: string, role: string) => {
    return await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select("-password")
  },

  // Soft delete user
  softDeleteUser: async (id: string) => {
    return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select("-password")
  },

  // Restore deleted user
  restoreUser: async (id: string) => {
    return await User.findByIdAndUpdate(id, { isDeleted: false }, { new: true }).select("-password")
  },

  // Change user password
  changePassword: async (id: string, oldPassword: string, newPassword: string) => {
    const user = await User.findById(id)
    if (!user) {
      return null
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new Error("Current password is incorrect")
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    return await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).select("-password")
  }
}
