import mongoose from "../mongoose-global-setUp.js";
import { Schema } from "mongoose";


const recipeSchema = new Schema ({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: Number,
        required: true
    },
    createdBy:{
        type : Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId:{
        type : Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    image: String
}, {
    timestamps: true,
    versionKey: false
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;