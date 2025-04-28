import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateBookingStatuses = async () => {
  const now = new Date();
  try {
    await prisma.checkout.updateMany({
      where: {
        status: 'active',
        bookingDate: { lte: now },
        bookingTime: { lte: now.toTimeString().split(' ')[0] },
      },
      data: { status: 'done' },
    });
    console.log('Booking statuses updated successfully.');
  } catch (error) {
    console.error('Failed to update booking statuses:', error);
  }
};