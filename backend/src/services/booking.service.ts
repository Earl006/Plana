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

  async cancelBooking(bookingId: string): Promise<Booking> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { TicketBookings: true },
    });

    if (!booking) {
      throw new Error(`Booking not found for id ${bookingId}`);
    }

    for (const ticketBooking of booking.TicketBookings) {
      await prisma.ticket.update({
        where: { id: ticketBooking.ticketId },
        data: {
          quantity: {
            increment: ticketBooking.quantity,
          },
        },
      });
    }

    return prisma.booking.delete({
      where: { id: bookingId },
    });
  }

  async verifyBooking(bookingId: string, verificationCode: string): Promise<{ 
    valid: boolean; 
    message: string;
    debug: {
      bookingFound: boolean;
      verificationMatch: boolean;
      eventNotPassed: boolean;
      updateSuccessful: boolean;
    }
  }> {
    let booking;
    try {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { event: true },
      });
    } catch (error) {
      return { 
        valid: false, 
        message: "Error fetching booking details",
        debug: {
          bookingFound: false,
          verificationMatch: false,
          eventNotPassed: false,
          updateSuccessful: false
        }
      };
    }
  
    if (!booking) {
      return { 
        valid: false, 
        message: "Booking not found",
        debug: {
          bookingFound: false,
          verificationMatch: false,
          eventNotPassed: false,
          updateSuccessful: false
        }
      };
    }
  
    if (booking.verified) {
      return { 
        valid: false, 
        message: "Booking has already been verified",
        debug: {
          bookingFound: true,
          verificationMatch: false,
          eventNotPassed: false,
          updateSuccessful: false
        }
      };
    }
  
    const verificationMatch = booking.verificationCode === verificationCode;
    if (!verificationMatch) {
      return { 
        valid: false, 
        message: "Invalid verification code",
        debug: {
          bookingFound: true,
          verificationMatch: false,
          eventNotPassed: false,
          updateSuccessful: false
        }
      };
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventNotPassed = booking.event.date >= today;
    
    if (!eventNotPassed) {
      return { 
        valid: false, 
        message: "This event has already passed",
        debug: {
          bookingFound: true,
          verificationMatch: true,
          eventNotPassed: false,
          updateSuccessful: false
        }
      };
    }
  
    let updateSuccessful = false;
    try {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { verified: true },
      });
      updateSuccessful = true;
    } catch (error) {
      return { 
        valid: false, 
        message: "Error updating booking",
        debug: {
          bookingFound: true,
          verificationMatch: true,
          eventNotPassed: true,
          updateSuccessful: false
        }
      };
    }
  
    return { 
      valid: true, 
      message: "Booking verified successfully",
      debug: {
        bookingFound: true,
        verificationMatch: true,
        eventNotPassed: true,
        updateSuccessful: true
      }
    };
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
