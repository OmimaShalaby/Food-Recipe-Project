import { classError } from "../../Utils/ClassError.utils.js";


export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const reqKeys = ["body", "params", "query", "headers"];
        const validationErrors = [];
        for (const key of reqKeys) {
            if (schema[key]) {
                const {error} = schema[key].validate(req[key], { abortEarly: false });                
                if (error) {
                    console.log(error.details);
                    validationErrors.push(...error.details.map((detail) => detail.message));
                };
            };
        };
        
        if(validationErrors.length) next(new classError(`${validationErrors}`, 400))
        next();   // Continue to the next middleware/route handler
    };
};