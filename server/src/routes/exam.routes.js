import { Router } from 'express';

import { Exam } from '../models/Exam.js';

import {
  requireAuth,
  requireRole,
} from '../middleware/auth.js';

const router = Router();

// =========================
// GET ALL EXAMS
// =========================

router.get(
  '/',

  requireAuth,

  async (req, res) => {

    try {

      const exams =
        await Exam.find()
          .sort('-createdAt');

      return res.json({
        items: exams,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// GET SINGLE EXAM
// =========================

router.get(
  '/:id',

  requireAuth,

  async (req, res) => {

    try {

      const exam =
        await Exam.findById(
          req.params.id
        );

      if (!exam) {

        return res.status(404).json({

          message:
            'Exam not found',
        });
      }

      return res.json(
        exam
      );

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// CREATE EXAM
// =========================

router.post(
  '/',

  requireAuth,
  requireRole('admin'),

  async (req, res) => {

    try {

      const exam =
        await Exam.create({

          ...req.body,

          createdBy:
            req.user._id,
        });

      return res.status(201).json({

        success: true,

        exam,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// UPDATE EXAM
// =========================

router.patch(
  '/:id',

  requireAuth,
  requireRole('admin'),

  async (req, res) => {

    try {

      const exam =
        await Exam.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }
        );

      return res.json({

        success: true,

        exam,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        message:
          'Server Error',
      });
    }
  }
);

// =========================
// DELETE EXAM
// =========================

router.delete(
  '/:id',

  requireAuth,
  requireRole('admin'),

  async (req, res) => {

    try {

      await Exam.findByIdAndDelete(
        req.params.id
      );

      return res.json({

        success: true,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        message:
          'Server Error',
      });
    }
  }
);

export default router;