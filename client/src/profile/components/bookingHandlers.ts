import { cancelBooking } from '../../api/booking';
import { toast } from 'react-toastify';

export const handleCancelBooking = async (
  bookingId: number,
  setActiveBookings: React.Dispatch<React.SetStateAction<any[]>>,
  close: () => void
) => {
  try {
    await cancelBooking(bookingId);
    setActiveBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    close();
    toast.success('Vizitas sėkmingai atšauktas!');
  } catch (error) {
    toast.error('Nepavyko atšaukti vizito. Bandykite dar kartą.');
  }
};