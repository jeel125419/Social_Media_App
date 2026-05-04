import express from "express";
const router = express.Router()
import {useAuth} from '../middleware/useAuth.js'
import {getPage, register, login} from '../controller/userController.js'

router.get('/', getPage)

router.post('/register', register)

router.post('/login', login)

router.get('/profile', useAuth, async (req, res) => {
    res.json({message: 'This is a protected route', user: req.user})
})

export default router