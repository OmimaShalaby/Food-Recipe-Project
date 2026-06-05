import mongoose from "../mongoose-global-setUp.js";
import { Schema } from "mongoose";


const favoriteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
export default Favorite;