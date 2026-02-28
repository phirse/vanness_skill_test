import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import authRouter from './routes/auth.js';
import studentsRouter from './routes/students.js';
import assignmentsRouter from './routes/assignments.js';
import submissionsRouter from './routes/submissions.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
