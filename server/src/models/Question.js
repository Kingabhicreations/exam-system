import mongoose from 'mongoose';

// Supports MCQ (single/multi), True/False, Short answer.
const questionSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', index: true },
    type: {
      type: String,
      enum: ['mcq-single', 'mcq-multi', 'true-false', 'short'],
      required: true,
    },
    text: { type: String, required: true },
    options: [{ text: String, isCorrect: Boolean }], // for mcq/true-false
    correctAnswer: String, // for short answer
    marks: { type: Number, default: 1 },
    negativeMarks: { type: Number, default: 0 },
    subject: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
