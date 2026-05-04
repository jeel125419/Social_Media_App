import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import Like from '../models/Like.js'
import {useAuth} from '../middleware/useAuth.js'

export const getPage = (req, res) => {
    res.send('Hello world')
}

export const register = async (req, res) => {
    const {username, email, password} = req.body

    if (!username || !email || !password){
        return res.status(400).json({message: "All fields are required"})
    }

    const existingUser = await User.findOne({username})
    const existingEmail = await User.findOne({email})

    if (existingUser) {
        return res.status(400).json({message: "User already exists"})
    }

    if (existingEmail) {
        return res.status(400).json({message: "Email already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await User.create({username, email, password: hashedPassword})
    res.json({message: "User registered successfully", user})
}

export const login = async (req, res) => {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        return res.status(400).json({message: 'Invalid password'})
    }

    const token = jwt.sign(
        {userId: user._id},
        "SECRET_KEY",
        {expiresIn: '1h'}
    )

    res.json({message: 'Login successful', token})
}

export const createPost = async (req, res) => {
    const {content} = req.body
    const userId = req.user.userId

    if (!content) {
        return res.status(400).json({message: 'Content is required'})
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const post = await Post.create({text: content, user: userId})
    res.json({message: 'Post created successfully', post})

}

export const createComment = async (req, res) => {
    
    const {content} = req.body
    
    if (!content) {
        return res.status(400).json({message: 'Content is required'})
    }

    const userId = req.user.userId
    const user = await User.findById(userId)
    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }
    
    const postId = req.params.postId 
    const post = await Post.findById(postId)
    if (!post) {
        return res.status(400).json({message: 'Post not found'})
    }

    const comment = await Comment.create({text: content, user: userId, post: postId})
    res.json({message: "comment created successfully", comment})
    
}

export const likePost = async (req, res) => {
    const userId = req.user.userId
    const user = await User.findById(userId)

    if (!user) {
        return res.status(400).json({message: 'User not found'})
    }

    const postId = req.params.postId
    const post = await Post.findById(postId)

    if (!post) {
        return res.status(400).json({message: 'Post not found'})
    }

    const existingLike = await Like.findOne({user: userId, post: postId})

    if (existingLike) {
        return res.status(400).json({message: 'Like already exists by this user for this post'})
    }

    const like = await Like.create({user: userId, post: postId})
    res.json({message: 'Post liked successfully', like})
}