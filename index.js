import express from "express";
import "dotenv/config";
import connectionDB from "./DB/DB-Connection.js";
import axios from "axios";
import cors from "cors";
// routes
import userRoutes from "./src/Modules/Users/Users.routes.js";
import categoryRoutes from "./src/Modules/Category/Category.routes.js";
import recipeRoutes from "./src/Modules/Recipe/Recipe.routes.js";
import favoriteRoutes from "./src/Modules/Favorite/Favorite.routes.js";
// middleware
import { globalHandle } from "./src/Middlewares/Errorhandling.middleware.js";
// super-admin
import { seedAdmin } from "./src/seedAdmin.js";

import Recipe from "./DB/models/Recipe.models.js";

const app = express();

app.use(express.json());
app.use(cors());

await connectionDB();

app.use("/uploads", express.static("Utils/Uploads"));

// seedAdmin
seedAdmin();

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favorites", favoriteRoutes);

// app.get("/push", async(req, res)=>{
//     const {data} = await axios.get("https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza");    
//     const finalData = data.data.recipes;
//     const recipes = finalData.map((recipe)=>({
//         title: recipe.title,
//         description: recipe.publisher,
//         price: Math.floor(Math.random() * 10000000),
//         image: recipe.image_url,
//         createdBy: "6a2051e3afd5f4785369380c",
//         categoryId: "6a107da5077e8730f1c8de4f"
//     }));
//     const result = await Recipe.insertMany(recipes);
//     res.json(result);
// });

app.use(globalHandle);

app.listen(3000, () => console.log(`Server is running on port 3000`));