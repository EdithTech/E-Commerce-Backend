class ErrorHandler extends Error{
    constructor(statusCode, message = "somthing went wrong" , success, errors=[]){
        super(message);
        this.statusCode = statusCode
        this.errors = errors
        this.success = false

        Error.captureStackTrace(this, this.constructor);
    }
} 

export {ErrorHandler}