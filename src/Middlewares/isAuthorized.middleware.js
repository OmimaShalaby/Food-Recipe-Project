import { classError } from "../../Utils/ClassError.utils.js";



export const isAuthorized = (allowedRoles)=>{
    return async (req, res, next) => {
        const user = req.user;
        if(!allowedRoles.includes(user.role)) return next(new classError("You are not allowed", 403));
        next();
    };
};