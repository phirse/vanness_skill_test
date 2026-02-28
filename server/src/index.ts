import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRouter from './routes/auth';
import studentsRouter from './routes/students';
import assignmentsRouter from './routes/assignments';
import submissionsRouter from './routes/submissions';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/submissions', submissionsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
