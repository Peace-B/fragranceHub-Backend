import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js"
import dotenv from 'dotenv'
import Jwt from "jsonwebtoken";
import { cloudinary } from "../helpers/cloudinary.config.js";


// creating registration function
export const signUp = async (req, res) => {
  try {
    // handle req fields (req.body)
    const { name, email, password } = req.body;
    const image = req.file;
    // Field Validation
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is Required" });}

    if (!email) 
    {return res.status(400).json({ success: false, message: "Email is Required" });}

    if (!password) 
    {return res.status(400).json({ success: false, message: "Password is Required" });}

    // check if email is taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success: false, message: "Email already taken"});
    }

    // hash password
    const hashedPwd = await hashPassword(password);

    // create a new user object
    const user = new User({
      name,
      email,
      password: hashedPwd
    })

    //handle image upload

     if(image){
        try {
          const imagePath = await cloudinary.uploader.upload(image.path)
        user.image = imagePath.secure_url;
        user.imagePublicId = imagePath.public_id
     }
       catch (err) {
          console.log(err);
          return res.status(500).json({success: false, message: "error uploading image", err});
        }
      } 
    // save the new user to the database
    await user.save()

    //create token
    const token = Jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

    return res.json({
      success: true, 
      message: "user registered successfully",
       user: {
        name: user.name,
        role: user.role,
        image: user.image,
        imagePublicId: user.imagePublicId,
        token
       }})
  } catch (err) {
    console.log("Error creating registration", err.message);
    return res.status(500).json({ message: "Registration Failed", err});

  }
};
 export const login = async (req, res) => {
  try {
    // handle req fields (req.body)
    const { email, password } = req.body;

    // Field Validation
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is Required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is Required" });
    }

    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({success: false, message: "User not found"});
    }

    const token = Jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

    // hash password
    const match = await comparePassword(password, user.password);

    if(!match){
      return res.status(400).json({success: false, message: "Wrong password"});
    }
  
    return res.json({
      success: true, 
      message: "Login Successful", 
      user: {
        name: user.name,
        role: user.role,
        token,
      }
    })
  } catch (err) {
    console.log("Error creating registration", err.message);
    return res.status(500).json({ message: "Registration Failed", err});

  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if(!email) {
      return res.status(400).json({success: false, message: "Email is Required"})
    }
    //using the email,find the user
    const user = await User.findOne({ email })
    //if user is not found
    if (!user) {
      return res.status(404).json({success: false, message: "User not found"})
    }
     

    //generate password reset token
    const resetToken = Jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
    //send email to user with reset token
    const domain = "www.peace.com"
    const resetLink = `${domain}/reset-password/${resetToken}`

    //send response iincluding the reset token
    return res.json({success: true, message: "Password reset token generated successfully", resetToken})
    
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "failed to create reset token"})
  }
}
// resetPassword function
export const resetPassword = async(req, res) => {
  try {
    const { newPassword } = req.body;

    const resetToken = req.headers.authorization

    if(!newPassword){
      return res.status(400).json({success: false, message: 'Enter new password'})
    }
    if(!resetToken || !resetToken.startsWith("Bearer")){
      return res.status(401).json({success: false, message: 'invalid token or no reset token provided'}) 
    }

    //get token without the "Bearer"
    const token = resetToken.split(" ")[1]
    // console.log(token);

    // verify the token
    const decodedToken = Jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decodedToken);

    if(!decodedToken){
      return res.status(403).json({success: false, message: "Invalid/expired token provided"})
    }
    const userId = decodedToken.userId
    // console.log(userId);

    //find user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid user" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;

    // save user (including the new password)
    await user.save();

    res.json({success: true, message: "Password reset successfully" });

    
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({success: false, message: "Password reset failed", error: err.message});
    
  }
}
