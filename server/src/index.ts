import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendConfirmationEmail } from './utils/mailer';
import { authenticateToken, authorizeRole } from './middleware/auth';
import logger from './utils/logger';

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

// Sample route
app.get('/', (req, res) => {
  res.send('API is working');
});

app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  logger.info(`Registration attempt for email: ${email}`);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    await sendConfirmationEmail(email, token);

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({ message: 'Registracija sėkminga' });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Registration failed for email: ${email} - ${error.message}`);
    } else {
      logger.error(`Registration failed for email: ${email} - Unknown error`);
    }
    res.status(400).json({ error: 'Kažkas nutiko, bandykite dar kartą.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return void res.status(401).json({ error: 'Neteisingi duomenys.' });
  }

  if (!user.confirmed) {
    return void res.status(403).json({ error: 'Prašome patvirtinti savo el. pašto adresą.' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.json({ token, id: user.id, role: user.role });
});

app.get('/profile', authenticateToken, async (req, res): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    res.status(404).json({ error: 'Vartotojas nerastas.' });
    return;
  }

  res.json({ user });
});

app.get('/admin', authenticateToken, authorizeRole('admin'), async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

app.get('/client', authenticateToken, authorizeRole('client'), async (req, res) => {
  const bookings = await prisma.booking.findMany({ where: { userId: req.user.id } });
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
    res.json({ message: 'El. pašto adresas patvirtintas sėkmingai!' });
  } catch (error) {
    res.status(400).json({ error: 'Nepavyko patvirtinti el. pašto adreso.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));