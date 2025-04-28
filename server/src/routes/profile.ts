import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/previous-visits', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const previousVisits = await prisma.checkout.findMany({
      where: { userId, status: 'done' },
    });
    res.json(previousVisits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch previous visits.' });
  }
});

router.get('/user-info', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true, phoneNumber: true },
    });
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user info.' });
  }
});

export default router;