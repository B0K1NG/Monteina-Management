// server/src/routes/checkout.ts

import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient }                          from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post(
  '/',
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        userId,
        bookingDate,
        bookingTime,
        carDetails,
        selectedService,
        valveChange,
        tireQuantity,
        serviceId,
        totalAmount,
        advanceAmount,
        remainingAmount,
      } = req.body;

      const slotDate = new Date(bookingDate);

      const existing = await prisma.checkout.count({
        where: {
          bookingDate: slotDate,
          bookingTime,
        },
      });

      if (existing >= 2) {
        res.status(400).json({ error: 'This time slot is fully booked.' });
        return;
      }

      const newCheckout = await prisma.checkout.create({
        data: {
          userId,
          bookingDate:    slotDate,
          bookingTime,
          carBrand:       carDetails.make,
          carModel:       carDetails.model,
          tireSize:       carDetails.tireSize,
          serviceName:    selectedService.name,
          valveChange,
          tireQuantity,
          serviceId,
          totalAmount,
          advanceAmount,
          remainingAmount,
        },
      });

      res.status(200).json(newCheckout);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/bookings', async (req, res, next) => {
  try {
    const raw = req.query.date;
    if (!raw) {
      res.status(400).json({ error: 'Date is required (format: YYYY-MM-DD)' });
      return;
    }

    const dateString = Array.isArray(raw) ? raw[0] : raw;
    if (typeof dateString !== 'string') {
      res.status(400).json({ error: 'Date must be a string' });
      return;
    }

    const slotDate = new Date(dateString);

    const grouped = await prisma.checkout.groupBy({
      by: ['bookingTime'],
      where: { bookingDate: slotDate },
      _count: { bookingTime: true },
    });

    const bookings = grouped.map(r => ({
      booking_time: r.bookingTime,
      _count: { booking_time: r._count.bookingTime },
    }));

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
});

export default router;