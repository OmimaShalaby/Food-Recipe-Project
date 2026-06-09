import jwt from "jsonwebtoken";
import { classError } from "../../Utils/ClassError.utils.js";
import User from "../../DB/models/User.models.js";


export const auth = ()=>{
    return async (req, res, next) => {
        const {token} = req.headers;
        // check if token exist
        if (!token) {
            return next(new classError("Please login first", 404));
        };
        // check if token start with ozo==
        if (!token.startsWith("ozo==")) return next(new classError("Invalid token", 400));
        // remove ozo==
        const originalToken = token.split("ozo==")[1];
        // check if token is valid
        const decoded = jwt.verify(originalToken, process.env.JWT_SECRET);
        if (!decoded.email || !decoded.userId) {
            return next(new classError("Invalid payLoad", 400));
        };
        // check if user exist
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return next(new classError("User not found", 400));
        };
        // check if password changed 
        if (user.changedPasswordAt) {
            const passwordChangedAt = user.changedPasswordAt.getTime() / 1000;
            if(decoded.iat < passwordChangedAt){
                return next(new classError("User recently changed password, please login again", 400));
            };
        }
        req.user = user;
        next();
    };
};