import { PrismaClient, Prisma, Booking, User } from '@prisma/client';
import { TicketService } from './ticket.service';
import sendMail from '../bg-services/email.service';
import path from 'path';

const prisma = new PrismaClient();
const ticketService = new TicketService();

export class BookingService {
  async createBooking(
    userId: string,
    eventId: string,
    tickets: { ticketId: string, quantity: number }[],
    attendeeDetails: { firstName: string; lastName: string; ticketType: string }[]
  ): Promise<Booking> {
    let totalPrice = new Prisma.Decimal(0);

    for (const ticket of tickets) {
      const ticketData = await prisma.ticket.findUnique({
        where: { id: ticket.ticketId }
      });

      if (!ticketData) {
        throw new Error(`Ticket not found for id ${ticket.ticketId}`);
      }

      if (ticketData.quantity < ticket.quantity) {
        throw new Error(`Not enough tickets available for id ${ticket.ticketId}`);
      }

      totalPrice = totalPrice.add(ticketData.price.mul(ticket.quantity));
    }

    const verificationCode = this.generateVerificationCode();

    const booking = await prisma.booking.create({
      data: {
        userId,
        eventId,
        quantity: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
        totalPrice,
        verificationCode,
        TicketBookings: {
          create: tickets.map(ticket => ({
            ticketId: ticket.ticketId,
            quantity: ticket.quantity,
          })),
        },
      },
      include: {
        event: true,
        TicketBookings: true,
        user: true,
      }
    });

    for (const ticket of tickets) {
      await prisma.ticket.update({
        where: { id: ticket.ticketId },
        data: {
          quantity: {
            decrement: ticket.quantity,
          },
        },
      });
    }

    const ticketFilePaths: string[] = [];

    for (const attendee of attendeeDetails) {
      const filePath = await ticketService.generateTicket(booking.id, attendee);
      ticketFilePaths.push(filePath);
    }

    const attachments = ticketFilePaths.map(filePath => ({
      filename: path.basename(filePath),
      path: filePath,
      contentType: 'application/pdf',
    }));

    await sendMail({
      email: booking.user.email,
      subject: 'Your Event Tickets',
      template: path.join(__dirname, '../mails/tickets.ejs'),
      body: {
        firstName: booking.user.firstName,
        lastName: booking.user.lastName,
        eventTitle: booking.event.title,
      },
      attachments,
    });

    return booking;
  }

  async getBooking(bookingId: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        event: true,
        TicketBookings: true,
        user: true,
      },
    });
  }

  async getAllBookings(): Promise<Booking[]> {
    return prisma.booking.findMany({
      include: {
        event: true,
        TicketBookings: true,
        user: true,
      },
    });
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        event: true,
        TicketBookings: true,
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
