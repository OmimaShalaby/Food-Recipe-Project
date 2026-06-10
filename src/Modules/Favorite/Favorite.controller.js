import Favorite from "../../../DB/models/Favorite.models.js";
import { classError } from "../../../Utils/ClassError.utils.js";


// =================================== add Favorite ==========================================
export const addFavorite = async(req, res, next)=>{
        // get user id
        const userId = req.user._id;
        // get recipe id
        const {recipeId} = req.body.id;
        // Favorite instance        
        const addFavorite = new Favorite({ 
                userId, 
                recipeId
                });
        // check if Favorite exist
        if(!userId || !recipeId) return next(new classError("Please provide userId and recipeId", 400))
        await addFavorite.save();
        return res.status(201).json({msg:"Favorite added successfully", addFavorite});
};

// =================================== get all Favorites for one user ==========================================
export const getUserFavorites = async(req, res, next)=>{
        const Favorites = await Favorite.find({userId: req.user._id})
        .populate("recipeId userId", "name title -_id");
        if(!Favorites) return next(new classError("Favorites not found", 404))
        if(Favorites.length) return res.status(200).json({Favorites});
        return res.status(404).json({msg:"Favorites not found"});
};

// =================================== delete Favorite ==========================================
export const deleteFavorite = async(req, res, next)=>{
        // get user id
        const userId = req.user._id;
        // get Favorite id
        const favoriteId = req.params.id;
        // get Favorite
        const getFavorite = await Favorite.findById(favoriteId);
        // check if Favorite not exist
        if(!getFavorite) return next(new classError("Favorite already deleted", 404))
        // check if Favorite belongs to user
        if (getFavorite.userId.toString() !== userId.toString()) {
                return next(new classError("You are not authorized to delete this Favorite", 403));
        };
        // delete Favorite
        await getFavorite.deleteOne();
        // response
        return res.status(200).json({getFavorite});
};