import express from 'express';
import { createBooking, getBooking, verifyBooking } from '../controllers/booking.controller';

const router = express.Router();

router.post('/create', createBooking);
router.get('/bookings/:bookingId', getBooking);
router.get('/verify/:bookingId/', verifyBooking);

export default router;
