import express from 'express';
import { createBooking, getBooking, verifyBooking, getAllBookings, getBookingsByUser, getVerifiedBookings } from '../controllers/booking.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create',authenticateJWT, createBooking);
router.get('/bookings/:bookingId', getBooking);
router.post('/verify/:bookingId', verifyBooking);
router.get('/all',getAllBookings);
router.get('/user/:userId',authenticateJWT, getBookingsByUser);
router.delete('/cancel/:bookingId',authenticateJWT, verifyBooking);
router.get('/bookings/v/verified',getVerifiedBookings)


export default router;
