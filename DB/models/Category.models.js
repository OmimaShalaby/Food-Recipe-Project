import mongoose from "../mongoose-global-setUp.js";
import { Schema } from "mongoose";


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
});

const Category = mongoose.model("Category", categorySchema);
export default Category;