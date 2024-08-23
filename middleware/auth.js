import jwt, { decode } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ErrorHandler } from "../utils/errorHandler.js"
import { User } from "../models/userModel.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header.authorization

    if(!token){
        throw new ErrorHandler(400, "Unauthorized access");
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
    if(!user){
        throw new ErrorHandler(400, "Invalid access token");
    }

    req.user = user;
    
    next();

})