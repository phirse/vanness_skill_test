import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Assignment from './models/Assignment.js';
import Submission from './models/Submission.js';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not defined');
  process.exit(1);
}

await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB');

// Clear existing data
await Submission.deleteMany({});
await Assignment.deleteMany({});
await User.deleteMany({});
console.log('Cleared existing data');

// Create users
const instructor = await User.create({
  name: 'Dr. Smith',
  email: 'instructor@test.com',
  password: 'password123',
  role: 'instructor',
});

const student1 = await User.create({
  name: 'Alice Johnson',
  email: 'student1@test.com',
  password: 'password123',
  role: 'student',
  studentId: 'STU001',
  academicYear: '2025',
});

const student2 = await User.create({
  name: 'Bob Williams',
  email: 'student2@test.com',
  password: 'password123',
  role: 'student',
  studentId: 'STU002',
  academicYear: '2025',
});

const student3 = await User.create({
  name: 'Carol Davis',
  email: 'student3@test.com',
  password: 'password123',
  role: 'student',
  studentId: 'STU003',
  academicYear: '2025',
});

console.log('Created users');

// Create assignments
const now = new Date();
const dayMs = 24 * 60 * 60 * 1000;

const [a1, a2, a3, a4] = await Assignment.insertMany([
  {
    title: 'React Basics Quiz',
    description: 'Complete the quiz on React fundamentals including JSX, components, and props.',
    dueDate: new Date(now.getTime() + 14 * dayMs),
    totalPoints: 100,
    createdBy: instructor._id,
  },
  {
    title: 'REST API Project',
    description: 'Build a RESTful API with Express and MongoDB.',
    dueDate: new Date(now.getTime() + 7 * dayMs),
    totalPoints: 150,
    createdBy: instructor._id,
  },
  {
    title: 'CSS Layout Exercise',
    description: 'Recreate the provided layout using Flexbox and Grid.',
    dueDate: new Date(now.getTime() - 3 * dayMs),
    totalPoints: 50,
    createdBy: instructor._id,
  },
  {
    title: 'Database Design',
    description: 'Design a normalized database schema for an e-commerce platform.',
    dueDate: new Date(now.getTime() - 7 * dayMs),
    totalPoints: 80,
    createdBy: instructor._id,
  },
]);

console.log('Created assignments');

// Create submissions
await Submission.insertMany([
  // Assignment 1 (future due) — student1 submitted on time
  {
    assignment: a1._id,
    student: student1._id,
    submittedAt: new Date(),
  },
  // Assignment 2 (future due) — no submissions yet

  // Assignment 3 (past due) — student1 submitted on time, student2 submitted late, student3 not submitted
  {
    assignment: a3._id,
    student: student1._id,
    submittedAt: new Date(a3.dueDate.getTime() - 1 * dayMs),
  },
  {
    assignment: a3._id,
    student: student2._id,
    submittedAt: new Date(a3.dueDate.getTime() + 1 * dayMs),
  },
  // Assignment 4 (past due) — student1 graded, student2 submitted, student3 graded
  {
    assignment: a4._id,
    student: student1._id,
    submittedAt: new Date(a4.dueDate.getTime() - 2 * dayMs),
    score: 72,
  },
  {
    assignment: a4._id,
    student: student2._id,
    submittedAt: new Date(a4.dueDate.getTime() - 1 * dayMs),
  },
  {
    assignment: a4._id,
    student: student3._id,
    submittedAt: new Date(a4.dueDate.getTime() + 1 * dayMs),
    score: 55,
  },
]);

console.log('Created submissions');

console.log('\n--- Seed complete ---');
console.log('Instructor: instructor@test.com / password123');
console.log('Student 1:  student1@test.com   / password123');
console.log('Student 2:  student2@test.com   / password123');
console.log('Student 3:  student3@test.com   / password123');

await mongoose.disconnect();
