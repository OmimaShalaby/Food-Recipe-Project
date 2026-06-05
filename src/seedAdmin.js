import User from "../DB/models/User.models.js";
import bcrypt from "bcrypt";
import { errorHandling } from "./Middlewares/Errorhandling.middleware.js";


export const seedAdmin = async(req, res, next)=>{
    // check if admin exict
    const admin = await User.findOne({role: "Super-Admin"});
    if (!admin) {
    // hash password
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, Number(process.env.SALT_ROUNDS));
    // admin instance
    const adminUser = new User({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "Super-Admin",
        status: "Active"
    });
    // save admin
    await adminUser.save();
    };
};