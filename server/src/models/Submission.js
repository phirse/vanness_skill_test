import mongoose, { Schema } from 'mongoose';

const NoteSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorRole: { type: String, enum: ['student', 'instructor'], required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const SubmissionSchema = new Schema(
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

export default mongoose.model('Submission', SubmissionSchema);
