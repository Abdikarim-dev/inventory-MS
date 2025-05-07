import { Router } from 'express';
import { register, login } from './auth.controller'; // assuming these are your controller functions

const router = Router();

// Fix: Use the handlers as middleware functions
router.post("/register", async (req, res, next) => {
    try {
        await register(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        await login(req, res, next);
    } catch (error) {
        next(error);
    }
});

export default router;
