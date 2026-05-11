import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: String,
    durationMinutes: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, default: 0 },
    negativeMarking: { type: Boolean, default: false },
    startsAt: Date,
    endsAt: Date,
    isPublished: { type: Boolean, default: false },
    randomize: { type: Boolean, default: true },
    questionCount: { type: Number, default: 0 }, // pulled from pool if randomized
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Exam = mongoose.model('Exam', examSchema);
