import mongoose, { Document, Schema } from 'mongoose';

export interface INote {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorRole: 'student' | 'instructor';
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  submittedAt?: Date;
  score?: number;
  notes: INote[];
}

const NoteSchema = new Schema<INote>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorRole: { type: String, enum: ['student', 'instructor'], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    submittedAt: { type: Date },
    score: { type: Number, min: 0 },
    notes: [NoteSchema],
  },
  { timestamps: true }
);

SubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
