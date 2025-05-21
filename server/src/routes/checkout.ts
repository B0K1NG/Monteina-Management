import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

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
        paymentStatus,
        userId,
        date,
        bookingDate,
        time,
        bookingTime,
        carDetails,
        selectedService,
        valveChange,
        tireQuantity,
        serviceId,
        totalAmount,
        advanceAmount,
        remaining,
        remainingAmount,
        status = 'active',
      } = req.body;

      if (paymentStatus !== 'success') {
        res.status(400).json({ error: 'Payment failed' });
        return;
      }

      const dateValue = date || bookingDate;
      const timeValue = time || bookingTime;

      if (!dateValue) {
        res.status(400).json({ error: 'A valid booking date is required' });
        return;
      }

      if (!timeValue && status === 'active') {
        res.status(400).json({ error: 'Booking time is required for active bookings' });
        return;
      }

      let slotDate: Date;
      try {
        if (typeof dateValue === 'string') {
          if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            slotDate = new Date(dateValue);
          } 
          else if (dateValue.includes('T')) {
            slotDate = new Date(dateValue.split('T')[0]);
          } 
          else {
            throw new Error('Invalid date format');
          }
        } else if (dateValue instanceof Date) {
          slotDate = dateValue;
        } else {
          throw new Error('Invalid date type');
        }

        if (isNaN(slotDate.getTime())) {
          throw new Error('Invalid date value');
        }
      } catch (error) {
        console.error('Date parsing error:', error, 'Provided date:', dateValue);
        res.status(400).json({ error: 'Invalid booking date format. Please use YYYY-MM-DD format.' });
        return;
      }

      let existing = 0;
      if (timeValue) {
        existing = await prisma.checkout.count({
          where: {
            bookingDate: slotDate,
            bookingTime: timeValue,
            status: 'active',
          },
        });
      }

      if (existing >= 2) {
        res.status(400).json({ error: 'This time slot is fully booked.' });
        return;
      }

      const newCheckout = await prisma.checkout.create({
        data: {
          userId,
          bookingDate: slotDate,
          bookingTime: timeValue || '',
          carBrand: carDetails?.make,
          carModel: carDetails?.model || '',
          tireSize: carDetails?.tireSize || '',
          serviceName: selectedService?.name || '',
          valveChange: !!valveChange,
          tireQuantity: Number(tireQuantity) || 0,
          serviceId: String(serviceId),
          totalAmount: Number(totalAmount) || 0,
          advanceAmount: Number(advanceAmount) || 0,
          remainingAmount: Number(remaining || remainingAmount) || 0,
          status: status,
        },
      });

      res.status(200).json(newCheckout);
    } catch (err) {
      console.error('Error in POST /api/checkout:', err);
      next(err);
    }
  }
);

router.get('/bookings', async (req, res) => {
  const { date } = req.query;
  try {
    const bookings = await prisma.checkout.groupBy({
      by: ['bookingTime'],
      where: {
        bookingDate: new Date(date as string),
        status: 'active',
      },
      _count: {
        bookingTime: true,
      },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

router.get('/all-bookings', async (req, res) => {
  try {
    const bookings = await prisma.checkout.findMany({
      select: {
        id: true,
        bookingDate: true,
        bookingTime: true,
        userId: true,
        serviceName: true,
        status: true,
        serviceId: true,
        totalAmount: true,
        carBrand: true,
        carModel: true,
        valveChange: true,
        tireQuantity: true,
      },
      orderBy: {
        bookingDate: 'asc',
      },
    });

    const userIds = bookings.map((booking) => booking.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    const userMap: Record<number, string> = users.reduce((acc: Record<number, string>, user) => {
      acc[user.id] = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      return acc;
    }, {});

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      bookingDate: booking.bookingDate.toISOString().split('T')[0],
      userName: userMap[booking.userId] || 'Unknown',
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error in GET /api/checkout/all-bookings:', error);
    res.status(500).json({ error: 'Failed to fetch all bookings.' });
  }
});

router.get('/active', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const activeBookings = await prisma.checkout.findMany({
      where: { 
        status: 'active',
        userId: userId
      },
    });
    res.json(activeBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active bookings.' });
  }
});

router.get('/done', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const doneBookings = await prisma.checkout.findMany({
      where: { 
        status: 'done',
        userId: userId
      },
    });
    res.json(doneBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch done bookings.' });
  }
});

router.get('/canceled', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const canceledBookings = await prisma.checkout.findMany({
      where: { 
        status: 'canceled',
        userId: userId
      },
    });
    res.json(canceledBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch canceled bookings.' });
  }
});

router.patch('/cancel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.checkout.update({
      where: { id: parseInt(id) },
      data: { status: 'canceled' },
    });
    res.json({ message: 'Booking canceled successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

router.patch('/:id', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.params;
  const { bookingDate, bookingTime, serviceId, status } = req.body;

  try {
    const existingBooking = await prisma.checkout.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if ((bookingDate || bookingTime) && (bookingDate !== existingBooking.bookingDate || bookingTime !== existingBooking.bookingTime)) {
      const count = await prisma.checkout.count({
        where: {
          bookingDate: bookingDate ? new Date(bookingDate) : existingBooking.bookingDate,
          bookingTime: bookingTime || existingBooking.bookingTime,
          status: 'active',
          id: { not: parseInt(id) },
        },
      });

      if (count >= 2) {
        return res.status(400).json({ error: 'Selected time slot is already fully booked.' });
      }
    }

    const updatedBooking = await prisma.checkout.update({
      where: { id: parseInt(id) },
      data: {
        bookingDate: bookingDate ? new Date(bookingDate) : undefined,
        bookingTime: bookingTime || undefined,
        serviceId: serviceId || undefined,
        status: status || undefined,
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking.' });
  }
});

export default router;