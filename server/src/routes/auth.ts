import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '../utils/mailer';

const router = Router();
const prisma = new PrismaClient();

router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.json({ message: 'Jei jūsų el. paštas egzistuoja sistemoje, gausite slaptažodžio atkūrimo nuorodą.' });
      return;
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000)
      },
      create: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000)
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    res.json({ message: 'Jei jūsų el. paštas egzistuoja sistemoje, gausite slaptažodžio atkūrimo nuorodą.' });
  } catch (error) {
    console.error('Error sending password reset:', error);
    res.status(500).json({ error: 'Nepavyko apdoroti slaptažodžio atkūrimo užklausos.' });
  }
});

router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      res.status(400).json({ error: 'Reikalingi abu laukai: token ir slaptažodis.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        userId: decoded.id,
        token,
        expiresAt: { gt: new Date() }
      }
    });

    if (!passwordReset) {
      res.status(400).json({ error: 'Neteisinga arba pasibaigusi atkūrimo nuoroda.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { 
        password: hashedPassword,
        confirmed: true 
      }
    });

    await prisma.passwordReset.delete({
      where: { id: passwordReset.id }
    });

    res.json({ message: 'Slaptažodis sėkmingai pakeistas.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(400).json({ error: 'Nepavyko atstatyti slaptažodžio.' });
  }
});

export default router;