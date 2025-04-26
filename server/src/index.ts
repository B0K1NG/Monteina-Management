import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from './utils/logger';
import checkoutRoutes from './routes/checkout';
import cors from 'cors';

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendConfirmationEmail } from './utils/mailer';
import { authenticateToken, authorizeRole } from './middleware/auth';
import { generateToken } from './middleware/auth';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => {
  if (req.user) {
    logger.info(`User with ID: ${req.user.id} and Role: ${req.user.role} accessed ${req.originalUrl}`);
  }
  next();
});

app.use('/api/checkout', checkoutRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('API is working');
});

app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = generateToken(user);

    await sendConfirmationEmail(email, token);

    res.status(201).json({ message: 'Registration successful.' });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong, please try again.' });
  }
});

app.post(
  '/auth/login',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      if (!user.confirmed) {
        res.status(403).json({ error: 'Please confirm your email address.' });
        return;
      }

      const token = generateToken(user);
      res.json({ token, id: user.id, role: user.role });
    } catch (err) {
      next(err);
    }
  }
);

app.post('/auth/resend-confirmation', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'Invalid request.' });
      return;
    }

    if (user.confirmed) {
      res.status(400).json({ error: 'Email address already confirmed.' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    await sendConfirmationEmail(email, token);

    res.json({ message: 'Confirmation email resent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to resend confirmation email.' });
  }
});

app.get('/auth/confirm', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;

  try {
    if (!token) {
      res.status(400).json({ error: 'Invalid request.' });
      return;
    }

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!);
    if (typeof decoded !== 'object' || !('id' in decoded)) {
      res.status(400).json({ error: 'Invalid request.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: (decoded as any).id } });

    if (!user) {
      res.status(404).json({ error: 'Invalid request.' });
      return;
    }

    if (user.confirmed) {
      res.status(400).json({ error: 'Invalid request.' });
      return;
    }

    await prisma.user.update({
      where: { id: (decoded as any).id },
      data: { confirmed: true },
    });

    res.json({ message: 'Email confirmed successfully!' });
  } catch (error) {
    logger.error(`Error confirming email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(400).json({ error: 'Invalid request.' });
  }
});

app.get('/profile', authenticateToken, async (req, res): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    res.status(404).json({ error: 'Invalid request.' });
    return;
  }

  res.json({ user });
});

app.get('/admin', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

app.get('/client', authenticateToken, authorizeRole('client'), async (req, res) => {
  const bookings = await prisma.booking.findMany({ where: { user_id: req.user.id } });
  res.json({ bookings });
});

app.get('/auth/confirm', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET!);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { confirmed: true },
    });
    res.json({ message: 'Email address confirmed successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to confirm email address.' });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));