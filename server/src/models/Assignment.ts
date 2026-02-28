import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description?: string;
  dueDate: Date;
  totalPoints: number;
  createdBy: mongoose.Types.ObjectId;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    totalPoints: { type: Number, required: true, min: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
