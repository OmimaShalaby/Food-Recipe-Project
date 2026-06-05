import Joi from "joi";
import { generalRules } from "../../../Utils/generalRules.utils.js";
import { systemRoles } from "../../../Utils/systemRules.utils.js";


export const addUserSchema = {
    body : Joi.object({
        name: Joi.string().min(3).max(99).trim().pattern(/^[\u0600-\u06FFa-zA-Z ]+$/).required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        role: Joi.string().valid(systemRoles.User, systemRoles.Admin).optional(),
        status: Joi.string().valid("Active", "InActive"),
        image: Joi.string()
    })
};

export const signInUserSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required()
    })
};

export const forgetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required()
    })
};

export const verifyOTPSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
        otp: Joi.string().length(6).required()
    })
};

export const resetPasswordSchema = {
    body: Joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required()
    })
};

export const updateUserSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(99).trim().pattern(/^[\u0600-\u06FFa-zA-Z ]+$/),
        email: generalRules.email,
        password: generalRules.password,
        role: Joi.string().valid(systemRoles.User, systemRoles.Admin),
        status: Joi.string().valid("Active", "InActive"),
        image: Joi.string()
    })
};