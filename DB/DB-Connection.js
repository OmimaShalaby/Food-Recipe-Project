import mongoose from "mongoose";


const connectionDB = async()=>{
    return await mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("DB connected");
    }).catch((err)=>{
        console.log({msg:"Failed to connect DB", err});
        
    });
};

export default connectionDB;