import bcrypt from 'bcrypt';

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

router.patch(
  '/change-password',
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Both current and new passwords are required.' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ error: 'Current password is incorrect.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
      });

      res.json({ message: 'Password updated successfully.' });
      return;
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password.' });
      return;
    }
  }
);

export default router;