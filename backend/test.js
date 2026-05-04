import mongoose from "mongoose";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";
import Like from "./models/Like.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/social_media_app";

const test = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // await User.deleteMany({ username: "testuser" });

        // await User.deleteMany()
        // await Post.deleteMany()
        // await Comment.deleteMany()
        // await Like.deleteMany()

        const user = await User.create({
            username: "jeel",
            email: "jeel@gmail.com",
            password: "hello123"
        })

        // const post = await Post.create({
        //     text: "This is a test post",
        //     user: user._id
        // })

        // const comment = await Comment.create({
        //     text: "This is a test comment",
        //     user: user._id,
        //     post: post._id
        // })

        const like = await Like.create({
            user: user._id,
            post: '69f5fa84e5f624bb4ecd3f91'
        })

        // console.log(users);
        // console.log(post);
        // console.log(comment);
        // console.log(like);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.disconnect();
    }
}

test();