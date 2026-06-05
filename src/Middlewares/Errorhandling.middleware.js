import { classError } from "../../Utils/ClassError.utils.js";
import fs from "fs";



export const errorHandling = (api)=>{
    return (req, res, next)=>{
        api(req, res, next).catch((err)=>{
            if(req?.file){
                fs.unlink(req.file.path, (unlinkErr)=>{
                if(unlinkErr){
                    console.log("Error deleting image:", unlinkErr);
                }
                });
            };
            next(
                new classError(
                    err.message || "Something went wrong",
                    err.statusCode || 500,
                    err.stack
                )
            )
        });
    };
};

export const globalHandle = (err, req, res, next)=>{
    if (err){
        return res.status(err["statusCode"] || 500).json({
            message: err.message,
            statusCode: err.cause,
            stack: err.stack
        });
    }
};