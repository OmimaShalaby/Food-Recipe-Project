import User from "../../../DB/models/User.models.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { classError } from "../../../Utils/ClassError.utils.js";
import jwt from "jsonwebtoken";
import pkg from "mongoose";
import Recipe from "../../../DB/models/Recipe.models.js";
import Category from "../../../DB/models/Category.models.js";

// ============================================= add new user ==========================================
export const addUser = async(req, res, next)=>{
        // destruct body
        let { name, email, password, role, status}= req.body;
        // hashPassword
        const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
        // user instance
        const user = new User({
                name,
                email,
                password: hashedPassword,
                role,
                status
                });
        // save user
        await user.save();
        return res.status(201).json({
                msg:"User added successfully",
                user
        });
};

// ================================================= signin user ==========================================
export const signInUser = async(req, res, next)=>{
        // destruct body
        const {email, password} = req.body;
        // check if user exist
        const user = await User.findOne({email}).select("+password");
        // return user
        if(!user) return next(new classError("User not found", 404))
        // check password
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if(!isValidPassword) return next(new classError("Invalid logIn credentials", 400))
        // create token
        const token = jwt.sign({userId: user._id ,email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d"});
        // return token
        return res.status(200).json({msg:"LogIn successfully" ,token});
};

// ============================================== forget password =======================================
export const forgetPassword = async(req, res, next)=>{
        // destruct body
        const {email} = req.body;
        // check if user exist
        const user = await User.findOne({email});
        if(!user) return next(new classError("There is no user with this email", 404));
        // generate otp
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSaltSync(8);
        user.otp = await bcrypt.hashSync(generatedOTP, salt);
        user.otpExpireAt = Date.now() + 10 * 60 * 1000;
        user.isOtpVerified = false;
        await user.save();
        // send email
        const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                }
        });
        const info = await transporter.sendMail({
                from:`"Food recipe App" <${process.env.EMAIL}>`,
                to: user.email,
                subject: "Reset Password",
                text: `Your OTP is ${generatedOTP} Valid for 10 minutes`
        });
        return res.status(200).json({msg:"OTP sent successfully", info});
};

// ================================================= verify OTP ==========================================
export const verifyOTP = async(req, res, next)=>{
        // destruct body
        const {email, otp} = req.body;
        // check if user exist
        const user = await User.findOne({email});
        if(!user) return next(new classError("There is no user with this email", 404));
        // check if OTP is expired
        if(user.otpExpireAt < Date.now()) return next(new classError("OTP is expired", 400));
        // check if otp is match
        const isMatch = await bcrypt.compare(otp, user.otp);
        if(!isMatch) return next(new classError("Invalid OTP code", 400));
        // update user
        user.isOtpVerified = true;
        await user.save();
        return res.status(200).json({msg:"OTP verified successfully, now you can reset your password"});
};

// ================================================ reset password =======================================
export const resetPassword = async(req, res, next)=>{
        // destruct body
        const {email, password} = req.body;
        // check if user exist
        const user = await User.findOne({email});
        if(!user) return next(new classError("There is no user with this email", 404));
        // check if user is verified
        if(!user.isOtpVerified) return next(new classError("Please verify your OTP first", 400));
        // hash password
        const hashedPassword = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
        // update user
        user.password = hashedPassword;
        user.changedPasswordAt = Date.now();
        // protect retry set password
        user.otp = undefined;
        user.isOtpVerified = false;
        user.otpExpireAt = undefined;
        // save changes
        await user.save();
        return res.status(200).json({msg:"Password reset successfully, you can logIn now"});
};

// ================================================= get user ==========================================
export const getUser = async(req, res, next)=>{
        const userId = req.user._id;
        // check if user exist
        const user = await User.findById(userId);
        if(!user) return next(new classError("User not found", 404));
        // response
        return res.status(200).json({user});
};

// ================================================= get all users ========================================
export const getAllUsers = async(req, res, next)=>{
        const {email, name} = req.query;
        const page = req.query.page || 1;
        const limit = req.query.limit || 2;
        const skip = (page - 1) * limit;
        const queryFilters = {};
        if(email) queryFilters.email = email;
        if(name) queryFilters.name = name;
        // get all users
        const users = await User.paginate(
                queryFilters,
                {
                        page,
                        limit,
                        skip,
                        select: "-password"
                }
        );
        if(!users) return next(new classError("Something went wrong", 404));
        return res.status(200).json({users});
};

// ================================================= update user ==========================================
export const updateUser = async(req, res, next)=>{
        // get user id
        const userId = req.user._id;
        // destruct body
        const updateData = {};
        if (req.body.name)       updateData.name = req.body.name;
        if (req.body.email)      updateData.email = req.body.email;
        if (req.body.password)   updateData.password = bcrypt.hashSync(req.body.password, 8);
        if (req.body.status)     updateData.status = req.body.status;
        if(req.body.role && req.user.role !== "Admin"){
                return next(new classError("You are not allowed to update role", 403));
        };
        if (req.body.role)       updateData.role = req.body.role;
        // update user
        const user = await User.findByIdAndUpdate(
                userId,
                updateData,
                {
                        returnDocument: "after"
                }
        );
        // check if user is authorized
        if(!user) return next(new classError("User not found", 404))
        return res.status(200).json({user});
};

// ================================================= delete user ==========================================
export const deleteUser = async(req, res, next)=>{
        const user = await User.findByIdAndDelete(req.user._id, {returnDocument: "before"});
        if(!user) return next(new classError("User already deleted", 404))
        return res.status(200).json({user});
};

// ================================================= dashboard ==========================================
export const dashboard = async(req, res, next)=>{
        const [userCount, recipeCount, categoryCount] = await Promise.all([
                User.countDocuments(),
                Recipe.countDocuments(),
                Category.countDocuments()
        ]);
        return res.status(200).json({msg:"Dashboard",
                totalUsers: userCount, 
                totalRecipes: recipeCount, 
                totalCategories: categoryCount
        });
};