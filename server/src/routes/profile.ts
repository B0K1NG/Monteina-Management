import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/previous-visits', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const previousVisits = await prisma.checkout.findMany({
      where: { userId },
      select: {
        bookingDate: true,
        totalAmount: true,
        serviceName: true,
      },
      orderBy: { bookingDate: 'desc' },
    });

    res.status(200).json(previousVisits);
  } catch (error) {
    console.error('Error fetching previous visits:', error);
    res.status(500).json({ error: 'Failed to fetch previous visits.' });
  }
});

export default router;