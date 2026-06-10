import { Router } from "express";
// controllers
import { addFavorite, deleteFavorite, getUserFavorites } from "./Favorite.controller.js";
// middlewares
import { errorHandling } from "../../Middlewares/Errorhandling.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import { isAuthorized } from "../../Middlewares/isAuthorized.middleware.js";
import roles from "../../../Utils/systemRules.utils.js";
import { validationMiddleware } from "../../Middlewares/Validation.middleware.js";
import { addFavoriteSchema } from "./Favorite.validation.js";


const router = Router();

router.post("/add", auth(), isAuthorized(roles.USER), validationMiddleware(addFavoriteSchema), errorHandling(addFavorite));
router.get("/get", auth(), isAuthorized(roles.USER), errorHandling(getUserFavorites));
router.delete("/delete/:id", auth(), isAuthorized(roles.USER), errorHandling(deleteFavorite));


export default router;