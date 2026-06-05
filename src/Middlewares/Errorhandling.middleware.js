import { classError } from "../../Utils/ClassError.utils.js";
import fs from "fs";



export const errorHandling = (api)=>{
    return(req, res, next)=>{
        api(req, res, next).catch((err)=>{
            if(req.file){
                console.log(req.file);
                
                fs.unlink(req.file.path, (unlinkErr)=>{
                if(unlinkErr){
                    console.log("Error deleting image:", unlinkErr);
                }
                });
            };
            next(new classError(
                err.message || "internal server error",
                err.cause,
                err.stack,
                {
                    originalmessage: err.message
                }
            ));
        });
    };
};

export const globalHandle = (err, req, res, next)=>{
    if (err){
        return res.status(err["statusCode"] || 500).json({
            message: "internal server error",
            message: err.message,
            statusCode: err.cause,
            stack: err.stack
        });
    }
};