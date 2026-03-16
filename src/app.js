import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes);


app.get("/api/health", (req, res) => {
    res.json({ status: 'ok', name: 'NullPointer API' })
})


app.use(errorHandler);
export default app;