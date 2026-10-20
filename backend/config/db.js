import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    if (!MONGO_URI) {
        throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(MONGO_URI, { family: 4 });
    console.log("Connected to MongoDB");
};