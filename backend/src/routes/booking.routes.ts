import express from 'express';
import { createBooking, getBooking, verifyBooking, getAllBookings, getBookingsByUser } from '../controllers/booking.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create',authenticateJWT, createBooking);
router.get('/bookings/:bookingId', getBooking);
router.post('/verify/:bookingId', verifyBooking);
router.get('/all',authenticateJWT,isAdmin,getAllBookings);
router.get('/user/:userId',authenticateJWT, getBookingsByUser);
router.delete('/cancel/:bookingId',authenticateJWT, verifyBooking);


export default router;
