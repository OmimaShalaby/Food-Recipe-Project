import Category from "../../../DB/models/Category.models.js";
import { classError } from "../../../Utils/ClassError.utils.js";



// ========================================== add new category ==========================================
export const addCategory = async(req, res, next)=>{
        // desrtuct body
        const {name} = req.body;
        const createdBy = req.user._id;
        // check if exict
        const isExist = await Category.findOne({name});
        if(isExist) return next (new classError("Category already exist", 400));
        // category instance
        const category = new Category({
                name,
                createdBy
                });
        // save categoryRecipeRecipe
        await category.save();
        return res.status(201).json({msg:"Category added successfully", category});
};

// ========================================== get all categories ==========================================
export const getAllCategories = async(req, res, next)=>{
        // destruct query
                const {name} = req.query;
                const page = req.query.page || 1;
                const limit = req.query.limit || 2;
                const skip = (page - 1) * limit;
                // filters
                const queryFilters = {};
                if(name) queryFilters.name = name;
                // get all users
                const categories = await Category.paginate(
                        queryFilters,
                        {
                                page,
                                limit,
                                skip
                        }
                );
        if(!categories) return next(new classError("There is no categories", 404))
        return res.status(200).json({categories});
};

// ========================================== update category ==========================================
export const updateCategory = async(req, res, next)=>{
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {returnDocument: "after"})
        .populate("createdBy", "name -_id");
        if(!category) return next(new classError("Category not found", 404))
        return res.status(200).json({category});
};

// ========================================== delete category ==========================================
export const deleteCategory = async(req, res, next)=>{
        const category = await Category.findByIdAndDelete(req.params.id, {returnDocument: "before"});
        if(!category) return next(new classError("Category already deleted", 404))
        return res.status(200).json({category});
};