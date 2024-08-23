import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const E_COMMERCE_DB_URL = process.env.MONGO_URL;

const connection = () => {
    mongoose.connect(`${E_COMMERCE_DB_URL}/ecommerce`);

    const db = mongoose.connection;

    db.on("connected", () => {
        console.log("Database connected succefully", E_COMMERCE_DB_URL);
    })
    db.on("disconnected", () => {
        console.log("Database Disconnected");
    })
    db.on("error", (error) => {
        console.log("MONGODB Error", error.message);
    })
}

export default connection;