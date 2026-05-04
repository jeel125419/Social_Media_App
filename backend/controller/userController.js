import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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