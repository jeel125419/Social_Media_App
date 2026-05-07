import express from "express";
const router = express.Router()
import {useAuth} from '../middleware/useAuth.js'
import {getPage, register, login, createPost, createComment, likePost, getPost, getPostById, getComments} from '../controller/userController.js'

router.get('/', getPage)

router.post('/register', register)

router.post('/login', login)

router.post('/createPost', useAuth, createPost)

router.post('/post/:postId/createComment', useAuth, createComment)

router.post('/post/:postId/like', useAuth, likePost)

router.get('/post', getPost)

router.get('/post/:postId', getPostById)

router.get('/post/:postId/comments', getComments)

export default router