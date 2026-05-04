import express from "express";
const router = express.Router()
import {useAuth} from '../middleware/useAuth.js'
import {getPage, register, login, createPost, createComment, likePost} from '../controller/userController.js'

router.get('/', getPage)

router.post('/register', register)

router.post('/login', login)

router.post('/createPost', useAuth, createPost)

router.post('/post/:postId/comment', useAuth, createComment)

router.post('/post/:postId/like', useAuth, likePost)

export default router