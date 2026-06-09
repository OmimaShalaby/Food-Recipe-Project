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

// create super-admin
seedAdmin();

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favorites", favoriteRoutes);

app.use("/", (req, res)=>{
    res.json({msg:"Hello world"});
})


app.use(globalHandle);

app.listen(3000, () => console.log(`Server is running on port 3000`));