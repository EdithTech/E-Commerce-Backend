import express from "express";
import connection from "./database/db.js";
import cors from "cors";
import Product from "./routes/productRoute.js";
import { errorHandlerMiddleware } from "./middleware/error.js";
import User from "./routes/userRoute.js"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Welcome to the E-Commerce App");
});

// Prodcut Routes
app.use('/api', Product);
app.use('/api/user', User);

app.use(errorHandlerMiddleware);

// mongodb connection
connection();


//server connection
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});
    