import { PrismaClient, Prisma, Booking } from '@prisma/client';
import { TicketService } from './ticket.service';

const prisma = new PrismaClient();
const ticketService = new TicketService();

export class BookingService {
    async createBooking(
        userId: string,
        eventId: string,
        ticketId: string,
        quantity: number,
        attendeeDetails: { firstName: string; lastName: string }[]
      ): Promise<Booking> {
        // Calculate total price
        const ticket = await prisma.ticket.findUnique({
          where: { id: ticketId }
        });
    
        if (!ticket) {
          throw new Error('Ticket not found');
        }
    
        // Check if enough tickets are available
        if (ticket.quantity < quantity) {
          throw new Error('Not enough tickets available');
        }
    
        const totalPrice = ticket.price.mul(quantity);
        const verificationCode = this.generateVerificationCode();
    
        // Create booking
        const booking = await prisma.booking.create({
          data: {
            userId,
            eventId,
            ticketId,
            quantity,
            totalPrice,
            verificationCode,
          },
          include: {
            event: true,
            ticket: true,
            user: true
          }
        });
    
        // Decrement ticket quantity
        await prisma.ticket.update({
          where: { id: ticketId },
          data: {
            quantity: {
              decrement: quantity,
            },
          },
        });
    
        // Generate tickets for each attendee
        for (let i = 0, len = attendeeDetails.length; i < len; i++) {
          await ticketService.generateTicket(booking.id, attendeeDetails[i]);
        }
    
        return booking;
      }

  async getBooking(bookingId: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        ticket: true,
        user: true,
      },
    });
  }

  async verifyBooking(bookingId: string, verificationCode: string): Promise<boolean> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true },
    });

    if (!booking) {
      return false;
    }

    // Check if the provided verification code matches the stored one
    if (booking.verificationCode !== verificationCode) {
      return false;
    }

    // Check if the event date is today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return booking.event.date >= today;
  }

  private generateVerificationCode(): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }
    return code;
  }
}