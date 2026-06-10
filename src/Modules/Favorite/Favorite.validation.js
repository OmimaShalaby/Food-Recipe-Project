import Joi from "joi";
import { generalRules } from "../../../Utils/generalRules.utils.js";


export const addFavoriteSchema = {
    body : Joi.object({
        recipeId: generalRules.objectId.required(),
    })
};