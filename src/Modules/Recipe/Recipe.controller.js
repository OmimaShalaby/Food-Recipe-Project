import Recipe from "../../../DB/models/Recipe.models.js";

import { classError } from "../../../Utils/ClassError.utils.js";

import fs from "fs";
import path from "path";


// ======================================== add new recipe ==========================================
export const addRecipe = async(req, res, next)=>{
        // get user id
        const createdBy = req.user._id;
        // destruct body
        let {title, description, price, categoryId, image} = req.body;
        if (req.file) image = `${req.protocol}://${req.get("host")}/Uploads/Recipes/${req.file.filename}`;
        
        // recipe instance
        const recipe = new Recipe({
                title,
                description,
                price,
                createdBy,
                categoryId,
                image
        });
        // save recipe
        await recipe.save();
        return res.status(201).json({msg:"Recipe added successfully", recipe});
};

// ======================================== get all recipes ==========================================
export const getAllRecipes = async(req, res, next)=>{
        // destruct query
        const {title, price} = req.query;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;
        // filters
        const queryFilters = {};
        if(title) queryFilters.title = title;
        if(price) queryFilters.price = price;
        // get all users
        const recipes = await Recipe.paginate(
                queryFilters,
                {
                        page,
                        limit,
                        skip
                }
        );
        if(!recipes) return next(new classError("There is no recipes", 404))
        return res.status(200).json({recipes});
};

// ======================================== get recipe by id ==========================================
export const getRecipeById = async(req, res, next)=>{
        const recipe = await Recipe.findById(req.params.id)
        .populate("categoryId createdBy", "name -_id");
        // check if recipe not exist
        if(!recipe) return next(new classError("Recipe not found", 404))
        return res.status(200).json({recipe});
};

// =================================== update recipe ==========================================
export const updateRecipe = async(req, res, next)=>{
        // get user id
        const userId = req.user._id;
        // get recipe
        const existingRecipe = await Recipe.findById(req.params.id);
        // check if doesnt exist
        if (!existingRecipe) {
        return next(new classError("Recipe not found", 404));
        };
        // check if recipe belongs to user
        if (existingRecipe.createdBy.toString() !== userId.toString()) {
                return next(new classError("You are not authorized to update this recipe", 403));
        };
        // destruct body
        const updateData = {};
        if (req.body.title)       updateData.title = req.body.title;
        if (req.body.description) updateData.description = req.body.description;
        if (req.body.price)       updateData.price = req.body.price;
        if (req.body.categoryId)  updateData.categoryId = req.body.categoryId;
        if (req.file) {
                if(!existingRecipe.image) return next(new classError("Image not found", 404))
                // old image url
                const oldImage = existingRecipe.image;
                // extract filename from url
                const fileName = oldImage.split("/").pop();

                // file path
                const filePath = path.join(
                process.cwd(),
                "Utils",
                "Uploads",
                "Recipes",
                fileName
                );

                // delete old image
                fs.unlink(filePath, (err) => {
                if (err) {
                        console.log("Error deleting image:", err);
                }
                });
                // save new image
                updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        };
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, {returnDocument: 'after'});
        // check if recipe found
        if(!recipe) return next(new classError("Recipe not found", 404))
        return res.status(200).json({recipe});
};

// =================================== delete recipe ==========================================
export const deleteRecipe = async(req, res, next)=>{
        // get user id
        const userId = req.user._id;
        // get recipe id
        const recipeId = req.params.id;
        // get recipe
        const recipe = await Recipe.findById(recipeId);
        // check if recipe not exist
        if(!recipe) return next(new classError("Recipe already deleted", 404))
        // check if recipe belongs to user
        if (recipe.createdBy.toString() !== userId.toString()) {
                return next(new classError("You are not authorized to delete this recipe", 403));
        };
        // delete image
        if (recipe.image) {
                const fileName = recipe.image.split("/").pop();
                const filePath = path.join(
                process.cwd(),
                "Utils",
                "Uploads",
                "Recipes",
                fileName
                );
                fs.unlink(filePath, (err) => {
                if (err) {
                        console.log("Error deleting image:", err);
                }
                });
        };
        // delete recipe
        await recipe.deleteOne();
        // response
        return res.status(200).json({recipe});
};