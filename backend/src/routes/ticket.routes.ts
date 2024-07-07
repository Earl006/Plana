import express from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { verifyBooking } from '../controllers/booking.controller';

const router = express.Router();
const ticketController = new TicketController();

router.get('/generate/:bookingId', authenticateJWT, ticketController.generateTicket);
router.get('/verify/:bookingId', authenticateJWT, verifyBooking);

export default router;