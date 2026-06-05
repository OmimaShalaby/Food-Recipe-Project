import Joi from "joi";
import { Types } from "mongoose";


const objectIdRule = (value, helpers) => {
    const isObjectIdValid = Types.ObjectId.isValid(value);
    return isObjectIdValid ? value : helpers.message("invalid object id");
};


export const generalRules = {
    objectId: Joi.string().custom(objectIdRule).required(),
    headers: {
        "content-type": Joi.string().valid("application/json").optional(),
        "accept-encoding": Joi.string().valid().optional(),
        accept: Joi.string().valid().optional(),
        "user-agent": Joi.string().valid().optional(),
        "content-length": Joi.string().valid().optional(),
        host : Joi.string().valid().optional(),
        connection: Joi.string().valid().optional(),
        "postman-token": Joi.string().valid().optional(),
    },
    email: Joi.string().email(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).message("invalid email"),
    password: Joi.string().min(6).max(10),
};