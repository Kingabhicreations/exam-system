import { Router } from 'express';

import { Attempt } from '../models/Attempt.js';

import { Question } from '../models/Question.js';

import {
  requireAuth,
} from '../middleware/auth.js';

const router = Router();

// =========================
// SUBMIT EXAM
// =========================

router.post(
  '/',

  requireAuth,

  async (req, res) => {

    try {

      const {
        exam,
        answers,
        warnings,
      } = req.body;

      // VALIDATION

      if (!exam) {

        return res.status(400).json({

          success: false,

          message:
            'Exam ID Missing',
        });
      }

      if (
        !Array.isArray(
          answers
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Answers Missing',
        });
      }

      // =========================
      // CALCULATE SCORE
      // =========================

      let score = 0;

      for (const ans of answers) {

        const question =
          await Question.findById(
            ans.question
          );

        if (!question)
          continue;

        const correctOption =
          question.options.find(
            (o) =>
              o.isCorrect === true
          );

        if (

          correctOption &&

          correctOption._id.toString() ===
            ans.selectedOption

        ) {

          score +=
            question.marks || 1;
        }
      }

      // =========================
      // SAVE ATTEMPT
      // =========================

      const attempt =
        await Attempt.create({

          user:
            req.user._id,

          exam,

          answers,

          warnings:
            warnings || 0,

          score,
        });

      console.log(
        'ATTEMPT SAVED'
      );

      return res.status(201).json({

        success: true,

        attempt,
      });

    } catch (error) {

      console.log(
        'ATTEMPT ERROR:',
        error
      );

      return res.status(500).json({

        success: false,

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// MY RESULTS
// =========================

router.get(
  '/me',

  requireAuth,

  async (req, res) => {

    try {

      const attempts =
        await Attempt.find({

          user:
            req.user._id,
        })

          .populate(
            'exam'
          )

          .sort(
            '-createdAt'
          );

      return res.json(
        attempts
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// LIVE MONITOR
// =========================

router.get(
  '/live',

  requireAuth,

  async (req, res) => {

    try {

      const attempts =
        await Attempt.find()

          .populate(
            'user',
            'name email'
          )

          .populate(
            'exam',
            'title'
          )

          .sort(
            '-createdAt'
          )

          .limit(20);

      return res.json(
        attempts
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// LEADERBOARD
// =========================

router.get(
  '/leaderboard',

  requireAuth,

  async (req, res) => {

    try {

      const leaderboard =
        await Attempt.find()

          .populate(
            'user',
            'name email'
          )

          .populate(
            'exam',
            'title'
          )

          .sort(
            '-score'
          )

          .limit(20);

      return res.json(
        leaderboard
      );

    } catch (error) {

      console.log(
        'LEADERBOARD ERROR:',
        error
      );

      return res.status(500).json({

        success: false,

        message:
          'Server Error',
      });
    }
  }
);

export default router;