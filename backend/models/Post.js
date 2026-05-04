import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            maxLength: 200,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", PostSchema)

export default Post;