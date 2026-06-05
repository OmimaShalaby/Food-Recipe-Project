import Joi from "joi";

export const addCategorySchema = {
    body : Joi.object({
        name: Joi.string().min(3).max(10).alphanum().trim().required(),
    })
};

export const updateCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(10).alphanum().trim(),
    })
};