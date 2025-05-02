import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateBookingStatuses = async () => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().substring(0, 5);
  
  try {
    const updatedBookings = await prisma.checkout.updateMany({
      where: {
        status: 'active',
        OR: [
          { bookingDate: { lt: now } },
          {
            bookingDate: { equals: new Date(currentDate) },
            bookingTime: { lte: currentTime }
          }
        ]
      },
      data: { status: 'done' },
    });
    
    console.log(`Booking statuses updated successfully. Updated ${updatedBookings.count} bookings.`);
  } catch (error) {
    console.error('Failed to update booking statuses:', error);
  }
};