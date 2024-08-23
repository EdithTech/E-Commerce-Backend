import { ApiResponse } from "../utils/apiResponse.js"

const errorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500

    res.status(statusCode).json(
        new ApiResponse(err.statusCode, {}, err.message, err.success)   
    )
}

export { errorHandlerMiddleware }