import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import {connectDB} from './config/db.js';

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())

connectDB()

app.use('/', userRoutes)

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}/ `);
    
})