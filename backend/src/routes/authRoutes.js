import { Router } from "express";
import { registerUser, loginUser, getAllUsers, updateUserRole, deleteUser } from "../controllers/authController.js"
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js"


const router = Router()


router.post("/register", registerUser)
router.post("/login", loginUser)

// Admin-only: manage users
router.get("/users", isAuthenticated, isAdmin, getAllUsers)
router.patch("/users/:id/role", isAuthenticated, isAdmin, updateUserRole)
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser)


export default router;