import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/', userRoutes);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`App listening at http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();