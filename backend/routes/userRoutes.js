import express from "express";
const router = express.Router()
import {useAuth} from '../middleware/useAuth.js'
import {getPage, register, login, createPost, createComment, likePost, getPost, getPostById, getComments, getLikes, deleteComment, deletePost, updateComment, updatePost} from '../controller/userController.js'

router.get('/', getPage)

router.post('/register', register)

router.post('/login', login)

router.post('/createPost', useAuth, createPost)

router.post('/post/:postId/createComment', useAuth, createComment)

router.post('/post/:postId/like', useAuth, likePost)

router.get('/post', getPost)

router.get('/post/:postId', getPostById)

router.get('/post/:postId/comments', getComments)

router.get('/post/:postId/likes', useAuth, getLikes)

router.delete('/post/:postId/:commentId', useAuth, deleteComment)

router.delete('/post/:postId', useAuth, deletePost)

router.put('/post/:postId/:commentId', useAuth, updateComment)

router.put('/post/:postId', useAuth, updatePost)

export default router