import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  changeUserRole,
  deleteUser,
  restoreUser,
  changePassword
} from "./user.controller";
import { authenticate, authorizeRoles } from "../auth/auth.middleware";

const router = Router();

// Wrap handlers in async middleware to properly handle promises
router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      await getAllUsers(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      await getUserById(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id/role",
  authenticate,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      await changeUserRole(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      await deleteUser(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id/restore",
  authenticate,
  authorizeRoles("admin"),
  async (req, res, next) => {
    try {
      await restoreUser(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/change-password",
  authenticate,
  async (req, res, next) => {
    try {
      await changePassword(req, res, next)
    } catch (error) {
      next(error)
    }
  }
)

export default router;
