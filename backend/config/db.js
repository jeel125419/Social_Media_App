import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/social_media_app";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
    }
}