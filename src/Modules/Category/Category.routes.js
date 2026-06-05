import { Router } from "express";
// controllers
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "./Category.controller.js";
// middlewares
import { errorHandling } from "../../Middlewares/Errorhandling.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import { validationMiddleware } from "../../Middlewares/Validation.middleware.js";
import { isAuthorized } from "../../Middlewares/isAuthorized.middleware.js";
// validation schemas
import { addCategorySchema, updateCategorySchema } from "./Category.validation.js";
// utils
import roles from "../../../Utils/systemRules.utils.js";



const router = Router();

router.post(
    "/add", 
    auth(),
    isAuthorized(roles.ADMIN_SUPER_ADMIN),
    validationMiddleware(addCategorySchema), 
    errorHandling(addCategory)
    );
router.get("/getAll", errorHandling(getAllCategories));
router.put(
    "/update/:id", 
    auth(),
    isAuthorized(roles.ADMIN_SUPER_ADMIN),
    validationMiddleware(updateCategorySchema), 
    errorHandling(updateCategory));
router.delete(
    "/delete/:id",
    auth(),
    isAuthorized(roles.ADMIN_SUPER_ADMIN),
    errorHandling(deleteCategory));


export default router;