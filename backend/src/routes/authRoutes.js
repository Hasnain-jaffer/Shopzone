import { Router } from "express";
import {
  registerUser, loginUser, logoutUser, getCurrentUser,
  getAllUsers, updateUserRole, deleteUser
} from "../controllers/authController.js"
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js"
import { registerValidators, loginValidators } from "../validators/authValidators.js"
import { validate } from "../middleware/validate.js"
import { authLimiter } from "../middleware/rateLimiters.js"

const router = Router()

router.post("/register", authLimiter, registerValidators, validate, registerUser)
router.post("/login", authLimiter, loginValidators, validate, loginUser)
router.post("/logout", logoutUser)
router.get("/me", isAuthenticated, getCurrentUser)

// Admin-only: manage users
router.get("/users", isAuthenticated, isAdmin, getAllUsers)
router.patch("/users/:id/role", isAuthenticated, isAdmin, updateUserRole)
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser)


export default router;
