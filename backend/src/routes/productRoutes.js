import { Router } from "express";
import { viewProduct, viewProductbyID, addProduct, updateProductbyID, deleteProductbyID } from "../controllers/productController.js";
import { isAdmin , isAuthenticated } from "../middleware/authMiddleware.js" 

const router = Router();

router.get("/",viewProduct)
router.post("/", isAuthenticated, isAdmin, addProduct)
  

router.get("/:id",viewProductbyID)
router.put("/:id", isAuthenticated, isAdmin, updateProductbyID)
router.delete("/:id", isAuthenticated, isAdmin, deleteProductbyID)


export default router;
