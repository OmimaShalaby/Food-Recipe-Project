import mongoose from "../mongoose-global-setUp.js";
import { Schema } from "mongoose";


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["User", "Admin", "Super-Admin"],
        default: "User"
    },
    status:{
        type: String,
        enum: ["Active", "InActive"],
        default: "InActive"
    },
    image: String,
    otp: String,
    otpExpireAt: Date,
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    changedPasswordAt: Date,
    resetPasswordExpireAt: Date
},
{
    versionKey: false,
    timestamps: true
});

const User = mongoose.model("User", UserSchema);
export default User;