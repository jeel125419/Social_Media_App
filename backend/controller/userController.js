import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import Like from '../models/Like.js'
import { useAuth } from '../middleware/useAuth.js'

export const getPage = (req, res) => {
    res.send('Hello world')
}

export const register = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const existingUser = await User.findOne({ username })
    const existingEmail = await User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }

    if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await User.create({ username, email, password: hashedPassword })
    res.json({ message: "User registered successfully", user })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    const username = user?.username

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
        { userId: user._id },
        "SECRET_KEY",
        { expiresIn: '1h' }
    )

    res.json({ message: 'Login successful', token, username })
}

export const createPost = async (req, res) => {
    const { content } = req.body
    const userId = req.user.userId

    if (!content) {
        return res.status(400).json({ message: 'Content is required' })
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const post = await Post.create({ text: content, user: userId })

    if (!post) {
        res.status(400).json({message: "Post not created"})
    }

    res.json({ message: 'Post created successfully', post })

}

export const createComment = async (req, res) => {

    const { content } = req.body

    if (!content) {
        return res.status(400).json({ message: 'Content is required' })
    }

    const userId = req.user.userId
    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const postId = req.params.postId
    const post = await Post.findById(postId)
    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    const comment = await Comment.create({ text: content, user: userId, post: postId })
    res.json({ message: "comment created successfully", comment })

}

export const likePost = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findById(userId)

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const postId = req.params.postId
    const post = await Post.findById(postId)

    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    const existingLike = await Like.findOne({ user: userId, post: postId })

    if (existingLike) {
        await Like.deleteOne({ user: userId, post: postId })

        const totalLikes = await Like.countDocuments({post: postId})

        return res.json({ message: 'post Unlike Successfully', isLikedByMe: false, totalLikes })
    }

    await Like.create({ user: userId, post: postId })
    const totalLikes = await Like.countDocuments({post: postId})
    res.json({ message: 'Post liked successfully', isLikedByMe: true, totalLikes })
}

export const getPost = async (req, res) => {
    const post = await Post.find().populate("user", "username").sort({ createdAt: -1 })
    res.json({ message: 'Posts retrieved successfully', post })
}

export const getPostById = async (req, res) => {
    const postId = req.params.postId

    const post = await Post.findById(postId).populate("user", "username")

    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    res.json({ message: 'Post retrieved successfully', post })
}

export const getComments = async (req, res) => {
    const postId = req.params.postId

    const comments = await Comment.find({ post: postId }).populate("user", "username").sort({ createdAt: -1 })

    res.json({ message: 'Comments retrieved successfully', comments })
}

export const getLikes = async (req, res) => {
    const postId = req.params.postId
    const userId = req.user.userId

    const isLikedByMe = await Like.findOne({ post: postId, user: userId }) ? true : false
    const totalLikes = await Like.countDocuments({ post: postId })

    await Like.find({ post: postId })
    res.json({ message: 'likes retrived successfully', isLikedByMe, totalLikes })
}

export const deleteComment = async (req, res) => {
    const postId = req.params.postId
    const commentId = req.params.commentId
    const userId = req.user.userId

    const user = await User.findById(userId)

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const post = await Post.findById(postId)

    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    const dltComment = await Comment.findOneAndDelete({ _id: commentId, user: userId, post: postId })

    return res.json({ message: "comment delete succesfully", dltComment })
}

export const deletePost = async (req, res) => {
    const userId = req.user.userId
    const postId = req.params.postId

    const user = await User.findById(userId)

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const post = await Post.findById(postId)

    if (!post) {
        return res.status(400).json({ message: 'Post not found' })
    }

    const dltPost = await Post.findOneAndDelete({ _id: postId, user: userId })

    return res.json({ message: "Post delete succesfully", dltPost })
}

export const updateComment = async (req, res) => {
    const userId = req.user.userId
    const postId = req.params.postId
    const commentId = req.params.commentId
    const { content } = req.body

    const upcmnt = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            user: userId,
            post: postId
        },
        {
            text: content
        },
        {
            new: true
        }
    )

    if (!upcmnt) {
        return res.status(404).json({ message: "Comment not found" })
    }

    return res.json({ message: "Comment Updated", upcmnt })
}

export const updatePost = async (req, res) => {
    const userId = req.user.userId
    const postId = req.params.postId
    const { content } = req.body

    const upPost = await Post.findOneAndUpdate(
        {
            _id: postId,
            user: userId
        },
        {
            text: content
        },
        {
            new: true
        }
    )

    if (!upPost) {
        return res.status(404).json({message: "Post not found"})
    }

    return res.json({message: "Post updated succesfully", upPost})
}