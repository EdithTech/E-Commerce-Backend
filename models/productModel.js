import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Provide the Name of the Product"],
        },

        description: {
            type: String,
            required: [true, "Please Provide the Description of the Product"],
        },

        price: {
            type: String,
            required: [true, "Please Provide the Price of the Product"],
            maxLength: [8, "Length cannot exceed 8 character"],
        },
        rating: {
            type: Number,
            default: 0,
        },

        image: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            }
        ],

        category: {
            type: String,
            required: [true, "Please Provide the Category of the Product"],
        },

        stock: {
            type: Number,
            required: [true, "Please Enter the stock"],
            maxLength: [4, "Stock length cannot be greater than 4 character "],
            default: 1
        },

        numberOfReviews: {
            type: Number,
            default: 0
        },

        reviews: [
            {
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                Comment: {
                    type: String,
                    required: true,
                },
            }
        ],

        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
        },

        // createdAt: {
        //     type: Date,
        //     default: Date.now
        // }
    },
    {
        timestamps: true
    }
)

const product = mongoose.model("Product", productSchema);

export default product;