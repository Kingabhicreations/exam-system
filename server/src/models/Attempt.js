import mongoose from 'mongoose';

const answerSchema =
  new mongoose.Schema({

    question: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'Question',
    },

    selectedOption:
      String,

  });

const attemptSchema =
  new mongoose.Schema({

    user: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'User',
    },

    exam: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: 'Exam',
    },

    answers:
      [answerSchema],

    score: {

      type: Number,

      default: 0,
    },

    warnings: {

      type: Number,

      default: 0,
    },

    status: {

      type: String,

      enum: [
        'live',
        'submitted',
        'suspicious',
      ],

      default: 'live',
    },

  },

  {
    timestamps: true,
  }
);

export const Attempt =
  mongoose.model(
    'Attempt',
    attemptSchema
  );