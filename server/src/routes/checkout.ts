import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

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

      if (paymentStatus !== 'success') {
        res.status(400).json({ error: 'Payment failed' });
        return;
      }

      const slotDate = new Date(bookingDate);

      const existing = await prisma.checkout.count({
        where: {
          bookingDate: slotDate,
          bookingTime,
          status: { not: 'canceled' },
        },
      });

      if (existing >= 2) {
        res.status(400).json({ error: 'This time slot is fully booked.' });
        return;
      }

      const newCheckout = await prisma.checkout.create({
        data: {
          userId,
          bookingDate: slotDate,
          bookingTime,
          carBrand: carDetails.make,
          carModel: carDetails.model,
          tireSize: carDetails.tireSize,
          serviceName: selectedService.name,
          valveChange,
          tireQuantity,
          serviceId,
          totalAmount,
          advanceAmount,
          remainingAmount,
          status: 'active',
        },
      });

      res.status(200).json(newCheckout);
    } catch (err) {
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
        status: { not: 'canceled' },
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
    }, {} as Record<number, string>);

    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      userName: userMap[booking.userId] || 'Unknown',
      bookingDate: booking.bookingDate.toISOString().split('T')[0],
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Error in GET /api/checkout/all-bookings:', error);
    res.status(500).json({ error: 'Failed to fetch all bookings.' });
  }
});

router.get('/active', async (req, res) => {
  try {
    const activeBookings = await prisma.checkout.findMany({
      where: { status: 'active' },
    });
    res.json(activeBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active bookings.' });
  }
});

router.get('/done', async (req, res) => {
  try {
    const doneBookings = await prisma.checkout.findMany({
      where: { status: 'done' },
    });
    res.json(doneBookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch done bookings.' });
  }
});

router.get('/canceled', async (req, res) => {
  try {
    const canceledBookings = await prisma.checkout.findMany({
      where: { status: 'canceled' },
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
          status: { not: 'canceled' },
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