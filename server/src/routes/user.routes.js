import { Router } from 'express';
import { User } from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Admin: list students with pagination + search
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { page = 1, limit = 20, q = '' } = req.query;
  const filter = q
    ? { $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }] }
    : {};
  const [items, total] = await Promise.all([
    User.find(filter).select('-password').skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
    User.countDocuments(filter),
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

router.patch('/me', requireAuth, async (req, res) => {
  const { name, avatarUrl } = req.body;
  const u = await User.findByIdAndUpdate(req.user._id, { name, avatarUrl }, { new: true }).select('-password');
  res.json({ user: u });
});

export default router;
