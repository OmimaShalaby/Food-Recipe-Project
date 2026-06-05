import User from "../../DB/models/User.models.js";


export const isExist = async(req, res, next)=>{
    try {
        // destruct email
        const {email} = req.body;
        // check if exict
        const isExict = await User.findOne({email});
        if (isExict) {
            return res.status(400).json({msg:"User already exict"});
        };
        next();
    } catch (error) {
        return res.status(500).json({msg:"isExict error", error})
    }
};