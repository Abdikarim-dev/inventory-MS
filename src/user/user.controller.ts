import type { Request, Response, NextFunction } from "express"
import { userService } from "./user.service"

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all active users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers()

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Change user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *     responses:
 *       200:
 *         description: User role updated
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export const changeUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body

    if (!role || !["admin", "staff"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be either "admin" or "staff"',
      })
    }

    const user = await userService.updateUserRole(req.params.id, role)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.softDeleteUser(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restore a deleted user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User restored successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
export const restoreUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.restoreUser(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "User restored successfully",
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /api/users/change-password:
 *   patch:
 *     summary: Change user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: User's current password
 *               newPassword:
 *                 type: string
 *                 description: New password (minimum 6 characters)
 *               confirmNewPassword:
 *                 type: string
 *                 description: Confirmation of the new password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request (passwords don't match, invalid length, or incorrect current password)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body
    const userId = req.user!.id

    // Validate required fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and password confirmation are required"
      })
    }

    // Check if new password and confirmation match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation do not match"
      })
    }

    // Validate new password length
    if (newPassword.length < 5) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      })
    }

    const user = await userService.changePassword(userId, currentPassword, newPassword)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    })
  } catch (error) {
    if (error instanceof Error && error.message === "Current password is incorrect") {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }
    next(error)
  }
}
