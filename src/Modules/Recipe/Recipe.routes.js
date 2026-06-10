import { Router } from "express";
// controllers
import { addRecipe, deleteRecipe, getAllRecipes, getRecipeById, updateRecipe } from "./Recipe.controller.js";
// middlewares
import { multerMiddleware } from "../../Middlewares/multer.middleware.js";
import { errorHandling } from "../../Middlewares/Errorhandling.middleware.js";
import { validationMiddleware } from "../../Middlewares/Validation.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import { isAuthorized } from "../../Middlewares/isAuthorized.middleware.js";
// validation schemas
import { addRecipeSchema, updateRecipeSchema } from "./Recipe.validation.js";
// utils
import roles from "../../../Utils/systemRules.utils.js";



const router = Router();

// add recipe
router.post(
    "/add", 
    auth(), 
    isAuthorized(roles.USER_ADMIN_SUPER_ADMIN), 
    multerMiddleware({filePath: "Recipes"}).single("image"), 
    validationMiddleware(addRecipeSchema), 
    errorHandling(addRecipe)
    );
// get all recipes
router.get("/getAll", errorHandling(getAllRecipes));
// get recipe by id
router.get("/getOne/:id", errorHandling(getRecipeById));
// update recipe
router.put(
    "/update/:id", 
    auth(), 
    isAuthorized(roles.USER_ADMIN_SUPER_ADMIN), 
    multerMiddleware({filePath:"Recipes"}).single("image"), 
    validationMiddleware(updateRecipeSchema), 
    errorHandling(updateRecipe)
    );
// delete recipe
router.delete(
    "/delete/:id", 
    auth(), 
    isAuthorized(roles.USER_ADMIN_SUPER_ADMIN), 
    errorHandling(deleteRecipe)
    );


export default router;