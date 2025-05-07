import type { Request, Response, NextFunction } from "express";
import passport from "./passport";
import type { IUser } from "../types/user.types";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// Middleware to authenticate user with JWT
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUser) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid token",
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};

// Middleware for role-based authorization
export const authorizeRoles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated - Make sure authenticate middleware is used first"
        });
        return;
      }

      const userRole = req.user.role;
      
      if (!userRole || !roles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message: "Unauthorized - Insufficient permissions"
        });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
