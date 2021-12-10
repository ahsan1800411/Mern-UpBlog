import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import subsRoutes from './routes/subs';
import articlesRoutes from './routes/articles';
import connectDatabase from './config/db';
import cors from 'cors';
const app = express();

dotenv.config();
// middlewares

app.use(express.json());
app.use(cors());

// routes
app.use('/auth', authRoutes);
app.use('/subs', subsRoutes);
app.use('/articles', articlesRoutes);

// db connection
connectDatabase();

app.listen(8080, () => {
  console.log('Server is up and running');
});
