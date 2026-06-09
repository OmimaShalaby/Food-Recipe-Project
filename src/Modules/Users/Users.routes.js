// imports
import { Router } from "express";
// middlewares
import { isExist } from "../../Middlewares/isExist.middleware.js";
import { validationMiddleware } from "../../Middlewares/Validation.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import { isAuthorized } from "../../Middlewares/isAuthorized.middleware.js";
// controllers
import { addUser, dashboard, deleteUser, forgetPassword, getAllUsers, getUser, resetPassword, signInUser, updateUser, verifyOTP } from "./User.controller.js";
import { errorHandling } from "../../Middlewares/Errorhandling.middleware.js";
// validation schemas
import { addUserSchema, updateUserSchema, signInUserSchema, verifyOTPSchema, forgetPasswordSchema, resetPasswordSchema } from "./User.validation.js";
// utils
import roles from "../../../Utils/systemRules.utils.js";


const router = Router();

// add user
router.post(
    "/add", 
    isExist,
    validationMiddleware(addUserSchema), 
    errorHandling(addUser)
    );
// sign in
router.post("/signin", validationMiddleware(signInUserSchema), errorHandling(signInUser));
// get user 
router.get("/get", auth(), isAuthorized(roles.USER_ADMIN_SUPER_ADMIN), errorHandling(getUser));
// forget password
router.post("/forget-password", validationMiddleware(forgetPasswordSchema), errorHandling(forgetPassword));
// verify otp
router.post("/verify-otp", validationMiddleware(verifyOTPSchema), errorHandling(verifyOTP));
// reset password
router.post("/reset-password",  validationMiddleware(resetPasswordSchema), errorHandling(resetPassword));
// get all users by admin
router.get("/getAll", auth(), isAuthorized(roles.ADMIN_SUPER_ADMIN), errorHandling(getAllUsers));
// update user
router.put("/update", auth(), isAuthorized(roles.USER_ADMIN_SUPER_ADMIN), validationMiddleware(updateUserSchema),errorHandling(updateUser));
// delete user
router.delete("/delete", auth(), isAuthorized(roles.USER_ADMIN_SUPER_ADMIN), errorHandling(deleteUser));

// dashboard
router.get("/dashboard", auth(), isAuthorized(roles.ADMIN_SUPER_ADMIN), errorHandling(dashboard));

export default router;