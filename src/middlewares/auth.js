import jwt from "jsonwebtoken";
import User from "../models/user.js"


export const isLoggedIn = async (req, res, next) => {
     const authHeader = req.headers.authorization;
     if(!authHeader || !authHeader.startsWith('Bearer')) {
         return res.status(401).json({ success: false, message: "invalid token or No token provided" });
     }

     //extract the token 
     const token = authHeader.split(" ")[1];

     //verify the token
     if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.status(403).json({ success: false, message: "invalid token" });
            } else {
                req.user = decoded;
                console.log({decoded});
                next()
            }
        })
     }else {
         return res.status(401).json({ success: false, message: "you're not authenticated" });
     }
}



export const isAdmin = async (req, res, next) => {
     try {
        const userId = req.user._id
        const user = await User.findById({_id: userId})
        console.log(user);
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }
        //check users role
        if(user.role === 1) {
            next()
        }
        else {
            return res.status(403).json({success: false, message: "unauthorized user"})
        }
      
     } catch (err) {
        console.log(err);
        res.json({success: false, message: "Error checking admin"})
     }
}