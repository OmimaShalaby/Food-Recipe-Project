import multer from "multer";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import {DateTime} from "luxon";
import { classError } from "../../Utils/ClassError.utils.js";


export const multerMiddleware = ({filePath = "Genaral"}= {}) => {
        // create directory path
        const destinationPath = path.resolve(`Utils/Uploads/${filePath}`);
        // create directory
        if(!fs.existsSync(destinationPath)){
            fs.mkdirSync(destinationPath);
        }
        // storage destination
        const storage = multer.diskStorage({
            destination: (req, file, cb)=> {
                cb(null, destinationPath);
            },
            filename: (req, file, cb)=> {
                const uniqueFileName = DateTime.now().toFormat("yyyy-mm-dd")+"__"+ nanoid(4)+"__"+file.originalname;
                cb(null, uniqueFileName);
            }
        });
        const fileFilter = (req, file, cb)=>{
            if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
                cb(null, true);
            }else{
                cb(new classError("Only jpg, jpeg, and png files are allowed"), false);
            }
        }
        return multer({fileFilter, storage});
};