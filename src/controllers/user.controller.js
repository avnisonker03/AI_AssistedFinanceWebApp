import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import bcrypt from "bcrypt";

export const registeration=(async(req,res)=>{
try {
          const {fullName,email,password}=req.body;
          if(!fullName || !email || !password){
            return res.status(400).json({
                message:"Incomplete fields Kindly provide all the required fields"
            })
          }
    
         const createdUser=await User.findOne({
             email:email
         })
         if(createdUser){
            return res.status(403).json({
                message:"User with this email already exists"
            })
         }
    
         const encryptedPassword=await bcrypt.hash(password,10);
    
         const user=await User.create({
            email:email,
            password:encryptedPassword,
            fullName:fullName
         })
    
         if(!user){
            return res.status(500).json({
                message:"Error creating user please try again..."
            })
         }
    
         return res.status(201).json({
            message:"user created successfully"
         })
} catch (error) {
    console.log("error registering user",error)
}

})

export const login=(async(req,res)=>{
   try {
     const {email,password}=req.body;
 
     if(!email || !password){
         return res.status(404).json({
             message:"Provide all the credentials"
         })
     }
 
     const user= await User.findOne({email:email});
     if(!user){
         return res.status(404).json({message:"user with this email or password doesn't exist"});
     }
    
     const isPasswordCorrect=await bcrypt.compare(password,user.password);
 
     if(!isPasswordCorrect){
         return res.status(404).json({message:"invalid credentials"});
     }
 
     const accessToken=generateAccessToken(user._id,user.email);
     const refreshToken=generateRefreshToken(user._id,user.email);
 
     const userDetails={
         fullName:user.fullName,
         email:user.email,
         expenses: user.expenses || [],
         incomes: user.incomes || [],
         budget: user.budgets || [],
         accessToken:accessToken,
         refreshToken:refreshToken
     }
 
     return res.status(200).json({
         message:"User logged in successfully",
         userDetails
     })
   } catch (error) {
    console.log("error logging in user",error)
   }

})

export const deleteUser=(async(req,res)=>{
    try {
        // Get user ID from request parameters
        const userId = req.params.id;

        // Validate if userId exists
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Perform the deletion
        const deletedUser= await User.findByIdAndDelete(userId);

        // Return success response
        if(!deletedUser){
           return res.status(500).json({
            message:"Error deleting user"
           })
        }
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Error in deleteUser controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
})
