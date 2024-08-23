import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            lowercase: true,
            required: [true, "Please provide the fullname"]
        },

        username: {
            type: String,
            lowercase: true,
            required: [true, "Please provide the username"]
        },

        email: {
            type: String,
            lowercase: true,
            required: [true, "Please email is already used"],
            unique: [true, "Email is already used"]
        },

        phone: {
            type: Number,
            required: [true, "Please phone number is already used"],
            unique: [true, "Phone number is already used"],
        },

        password: {
            type: String,
            required: [true, "Please enter the password"]
        },

        address: {
            type: String,
            lowercase: true,
        },

        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    const accessTokenPayload = {
        _id: this._id,
        username: this.username,
        role: "user",
    }

    return jwt.sign(
        accessTokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

}

userSchema.methods.generateRefreshToken = function () {
    const refreshTokenPayload = {
        _id: this._id,
    }

    return jwt.sign(
        refreshTokenPayload,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const User = mongoose.model('User', userSchema);

