import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

const bookingService = new BookingService();

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventId, ticketId, quantity, attendeeDetails } = req.body;
    const booking = await bookingService.createBooking(userId, eventId, ticketId, quantity, attendeeDetails);
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

export const verifyBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { verificationCode } = req.body;
    
    if (!verificationCode) {
      res.status(400).json({ error: 'Verification code is required' });
      return;
    }

    const isValid = await bookingService.verifyBooking(bookingId, verificationCode);
    res.status(200).json({ valid: isValid });
  } catch (error) {
    console.error('Error verifying booking:', error);
    res.status(500).json({ error: 'Failed to verify booking' });
  }
};