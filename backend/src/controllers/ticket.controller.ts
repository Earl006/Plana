import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';

const ticketService = new TicketService();

export class TicketController {
  async generateTicket(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const attendeeDetails = { 
        firstName: req.body.firstName, 
        lastName: req.body.lastName,
        ticketType: req.body.ticketType
      }; 
      const ticketUrl = await ticketService.generateTicket(bookingId, attendeeDetails);
      res.json({ ticketUrl });
    } catch (error) {
      console.error('Error generating ticket:', error);
      res.status(500).json({ error: 'Failed to generate ticket' });
    }
  }

//   async verifyTicket(req: Request, res: Response) {
//     try {
//       const { bookingId } = req.params;
//       const { verificationCode } = req.body;

//       if (!verificationCode) {
//         return res.status(400).json({ error: 'Verification code is required' });
//       }

//       const isValid = await ticketService.verifyTicket(bookingId, verificationCode);
//       res.json({ isValid });
//     } catch (error) {
//       console.error('Error verifying ticket:', error);
//       res.status(500).json({ error: 'Failed to verify ticket' });
//     }
//   }
}