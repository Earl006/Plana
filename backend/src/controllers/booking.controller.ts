import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

const bookingService = new BookingService();

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventId, tickets, attendeeDetails } = req.body;
    const booking = await bookingService.createBooking(userId, eventId, tickets, attendeeDetails);
    res.status(201).json({ booking, verificationCode: booking.verificationCode });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBooking(bookingId);
    if (booking) {
      res.status(200).json({ booking });
    } else {
      res.status(404).json({ error: 'Booking not found' });
    }
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};
export  const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try{
    const bookings = await bookingService.getAllBookings();
    if(bookings){
      res.status(200).json({ bookings });
    }
    else{
      res.status(404).json({ error: 'No bookings found' });
    }
  }catch(error){
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
  }
  export const getBookingsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const bookings = await bookingService.getBookingsByUser(userId);
      if (bookings) {
        res.status(200).json({ bookings });
      } else {
        res.status(404).json({ error: 'Bookings not found' });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  export const verifyBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;
      const { verificationCode } = req.body;
      
      if (!verificationCode) {
        res.status(400).json({ error: 'Verification code is required' });
        return;
      }
  
      const result = await bookingService.verifyBooking(bookingId, verificationCode);
      if (result.valid) {
        res.status(200).json({ message: result.message, valid: true, debug: result.debug });
      } else {
        res.status(400).json({ message: result.message, valid: false, debug: result.debug });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify booking', debug: { error: String(error) } });
    }
  };

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.cancelBooking(bookingId);
    res.status(200).json({ booking });
  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
}