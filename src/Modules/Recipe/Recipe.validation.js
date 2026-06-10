import Joi from "joi";
import { generalRules } from "../../../Utils/generalRules.utils.js";

export const addRecipeSchema = {
    body : Joi.object({
        title: Joi.string().min(3).max(10).alphanum().trim().required(),
        description: Joi.string().min(3).max(10).trim().required(),
        price: Joi.number().min(3).max(100000000000000000000).required(),
        categoryId: generalRules.objectId,
    })
};

export const updateRecipeSchema = {
    body: Joi.object({
        title: Joi.string().min(3).max(10).alphanum().trim(),
        description: Joi.string().min(3).max(10).alphanum().trim(),
        price: Joi.number().min(3).max(100000000000000000000),
        categoryId: generalRules.objectId.optional(),
    })
};