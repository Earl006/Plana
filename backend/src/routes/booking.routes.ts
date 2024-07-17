import express from 'express';
import { createBooking, getBooking, verifyBooking, getAllBookings } from '../controllers/booking.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create',authenticateJWT, createBooking);
router.get('/bookings/:bookingId', getBooking);
router.get('/verify/:bookingId/', verifyBooking);
router.get('/all',getAllBookings);

export default router;
