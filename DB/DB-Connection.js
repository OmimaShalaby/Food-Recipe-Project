import mongoose from "mongoose";

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("DB connected");
    } catch (err) {
        console.log("Failed to connect DB:", err);
        throw err;
    }
};

export default connectionDB;