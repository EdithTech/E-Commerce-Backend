import mongoose from "mongoose";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
// import jwt from "jsonwebtoken";

const generateRefreshAndAccessToken = async (user) => {
    try {
        // const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw ErrorHandler(400, "something went wrong while generating the access and refresh token")
    }
}

const signup = asyncHandler(async (req, res) => {
    // req.body -> data to create a  new user 
    // create a new user form this data

    // console.log("here");

    const userData = req.body;
    const newUser = await User.create(userData);

    if (!newUser) {
        throw new ErrorHandler(400, "Failed to create a user");
    }

    res.status(200).json(
        new ApiResponse(200, newUser, "User Created Succefully")
    )
});

const login = asyncHandler(async (req, res) => {
    // req.baody -> data
    // find user 
    // compare the password

    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ErrorHandler(400, "Please provide the email or username");
    }

    const user = await User.findOne(
        {
            $or: [{ username: username }, { email: email }]
        }
    );

    if (!user) {
        throw new ErrorHandler(400, "User not found");
    }

    if (!user.isValidPassword(password)) {
        throw new ErrorHandler(400, "Invalid Password");
    }

    // console.log("user", user);


    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User Logged in succefully"
            )
        );
})

const logout = asyncHandler(async (req, res) => {
    const user = req.user;

    await User.findByIdAndUpdate(
        user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out succesfully")
    )

})


export { signup, login, logout }