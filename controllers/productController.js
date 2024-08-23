import Product from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js"

export const product = asyncHandler(async (req, res) => {

    // const allProducts = await Product.countDocuments();   

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';
    // const price = Number(req.query.price) || '';
    const category = req.query.category || '';

    const filter = {};

    if (search) {
        filter.$or = [
            { name : { $regex: search, $options: 'i' }},
            { description: { $regex: search, $options: 'i'}}
        ]        
    }

    if(category){
        filter.category =  {$regex: category, $options: 'i'}
    }

    // pagination wal logic 
    const totalProduct = await Product.countDocuments();
    const offset = (page - 1) * limit;

    // query call
    const productPerPage = await Product.find(filter).skip(offset).limit(limit);

    if (!productPerPage) {
        console.log("Get Product", error.message);
        throw new ErrorHandler(400, "Products not found");
    }

    return res.status(200).json({
        products: new ApiResponse(200, productPerPage, "Product Found"),
        totalProduct,
        page,
        productOnThisPage: productPerPage.length
    });
})

export const createProduct = asyncHandler(async (req, res) => {

    const productData = req.body;
    const newProduct = await Product.create(productData);

    if (!newProduct) {
        throw new ErrorHandler(500, "Failed to create the product");
    }

    return res.status(200).json(
        new ApiResponse(200, newProduct, "Product created Successfully")
    );
})

export const update = asyncHandler(async (req, res) => {

    const id = req.params.id;
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );

    if (!updatedProduct) {
        throw new ErrorHandler(500, "Failed to update the product");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
    );

})

export const deleteProduct = asyncHandler(async (req, res) => {

    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
        console.log("product not found");
        throw new ErrorHandler(400, "Product not found")
    }

    const deletedProduct = await Product.findOneAndUpdate(
        { _id: id },
        { isDeleted: !product.isDeleted },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, deleteProduct, "Product deleted successfully")
    );

})

export const getProductDetails = asyncHandler(async (req, res) => {

    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
        console.log("product not found");

        throw new ErrorHandler(400, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product found")
    );
})



