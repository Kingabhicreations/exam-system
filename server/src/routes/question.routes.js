import { Router } from 'express';

import { Question } from '../models/Question.js';
import { Exam } from '../models/Exam.js';

import {
  requireAuth,
  requireRole,
} from '../middleware/auth.js';

const router = Router();

// =========================
// GET QUESTIONS
// =========================
// Students + Admins Allowed

router.get(
  '/',
  requireAuth,

  async (req, res) => {
    try {
      const {
        exam,
        page = 1,
        limit = 20,
        q = '',
      } = req.query;

      const filter = {};

      // Filter by Exam
      if (exam) {
        filter.exam = exam;
      }

      // Search
      if (q) {
        filter.text =
          new RegExp(q, 'i');
      }

      // Fetch Questions
      const [items, total] =
        await Promise.all([
          Question.find(filter)
            .skip(
              (page - 1) *
                Number(limit)
            )
            .limit(Number(limit))
            .sort('-createdAt'),

          Question.countDocuments(
            filter
          ),
        ]);

      return res.json({
        items,
        total,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

// =========================
// CREATE QUESTION
// =========================
// Admin Only

router.post(
  '/',
  requireAuth,
  requireRole('admin'),

  async (req, res) => {
    try {
      const q =
        await Question.create(
          req.body
        );

      await recomputeExamMarks(
        q.exam
      );

      return res.status(201).json({
        question: q,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

// =========================
// BULK CREATE
// =========================
// Admin Only

router.post(
  '/bulk',
  requireAuth,
  requireRole('admin'),

  async (req, res) => {
    try {
      const items =
        await Question.insertMany(
          req.body.questions || []
        );

      if (items[0]?.exam) {
        await recomputeExamMarks(
          items[0].exam
        );
      }

      return res.status(201).json({
        count: items.length,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

// =========================
// UPDATE QUESTION
// =========================
// Admin Only

router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),

  async (req, res) => {
    try {
      const q =
        await Question.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );

      if (q) {
        await recomputeExamMarks(
          q.exam
        );
      }

      return res.json({
        question: q,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

// =========================
// DELETE QUESTION
// =========================
// Admin Only

router.delete(
  '/:id',
  requireAuth,
  requireRole('admin'),

  async (req, res) => {
    try {
      const q =
        await Question.findByIdAndDelete(
          req.params.id
        );

      if (q) {
        await recomputeExamMarks(
          q.exam
        );
      }

      return res.json({
        ok: true,
      });

    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: 'Server Error',
      });
    }
  }
);

// =========================
// RECOMPUTE MARKS
// =========================

async function recomputeExamMarks(
  examId
) {
  if (!examId) return;

  const agg =
    await Question.aggregate([
      {
        $match: {
          exam: examId,
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: '$marks',
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

  const total =
    agg[0]?.total || 0;

  const count =
    agg[0]?.count || 0;

  await Exam.findByIdAndUpdate(
    examId,
    {
      totalMarks: total,
      questionCount: count,
    }
  );
}

export default router;