import { BookingService } from '../services/booking.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { TicketService } from '../services/ticket.service';
import sendMail from '../bg-services/email.service';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('./ticket.service');
jest.mock('../bg-services/email.service');

describe('BookingService', () => {
  let bookingService: BookingService;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    bookingService = new BookingService();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const userId = 'user1';
      const eventId = 'event1';
      const tickets = [{ ticketId: 'ticket1', quantity: 2 }];
      const attendeeDetails = [
        { firstName: 'John', lastName: 'Doe', ticketType: 'General' },
        { firstName: 'Jane', lastName: 'Doe', ticketType: 'General' },
      ];

      (mockPrismaClient.ticket.findUnique as jest.Mock).mockResolvedValue({
        id: 'ticket1',
        quantity: 5,
        price: new Prisma.Decimal(10),
      } as any);

      (mockPrismaClient.booking.create as jest.Mock).mockResolvedValue({
        id: 'booking1',
        userId,
        eventId,
        quantity: 2,
        totalPrice: new Prisma.Decimal(20),
        verificationCode: 'ABCDE12345',
        event: { title: 'Test Event' },
        user: { email: 'test@example.com', firstName: 'John', lastName: 'Doe' },
      } as any);

      const result = await bookingService.createBooking(userId, eventId, tickets, attendeeDetails);

      expect(result).toBeDefined();
      expect(result.id).toBe('booking1');
      expect(mockPrismaClient.booking.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaClient.ticket.update).toHaveBeenCalledTimes(1);
      expect(sendMail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if ticket is not found', async () => {
      const userId = 'user1';
      const eventId = 'event1';
      const tickets = [{ ticketId: 'nonexistent', quantity: 2 }];
      const attendeeDetails = [{ firstName: 'John', lastName: 'Doe', ticketType: 'General' }];

      (mockPrismaClient.ticket.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(bookingService.createBooking(userId, eventId, tickets, attendeeDetails))
        .rejects.toThrow('Ticket not found for id nonexistent');
    });

    it('should throw an error if not enough tickets are available', async () => {
      const userId = 'user1';
      const eventId = 'event1';
      const tickets = [{ ticketId: 'ticket1', quantity: 10 }];
      const attendeeDetails = [{ firstName: 'John', lastName: 'Doe', ticketType: 'General' }];

      (mockPrismaClient.ticket.findUnique as jest.Mock).mockResolvedValue({
        id: 'ticket1',
        quantity: 5,
        price: new Prisma.Decimal(10),
      } as any);

      await expect(bookingService.createBooking(userId, eventId, tickets, attendeeDetails))
        .rejects.toThrow('Not enough tickets available for id ticket1');
    });
  });

  describe('getBooking', () => {
    it('should return a booking when found', async () => {
      const bookingId = 'booking1';
      const mockBooking = { id: bookingId, userId: 'user1' } as any;

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.getBooking(bookingId);

      expect(result).toEqual(mockBooking);
      expect(mockPrismaClient.booking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: { event: true, TicketBookings: true, user: true },
      });
    });

    it('should return null when booking is not found', async () => {
      const bookingId = 'nonexistent';

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await bookingService.getBooking(bookingId);

      expect(result).toBeNull();
    });
  });

  describe('getAllBookings', () => {
    it('should return all bookings', async () => {
      const mockBookings = [
        { id: 'booking1', userId: 'user1' },
        { id: 'booking2', userId: 'user2' },
      ] as any[];

      (mockPrismaClient.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);

      const result = await bookingService.getAllBookings();

      expect(result).toEqual(mockBookings);
      expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith({
        include: { event: true, TicketBookings: true, user: true },
      });
    });
  });

  describe('getBookingsByUser', () => {
    it('should return bookings for a specific user', async () => {
      const userId = 'user1';
      const mockBookings = [
        { id: 'booking1', userId },
        { id: 'booking2', userId },
      ] as any[];

      (mockPrismaClient.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);

      const result = await bookingService.getBookingsByUser(userId);

      expect(result).toEqual(mockBookings);
      expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { event: true, TicketBookings: true, user: true },
      });
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking and return tickets to inventory', async () => {
      const bookingId = 'booking1';
      const mockBooking = {
        id: bookingId,
        TicketBookings: [
          { ticketId: 'ticket1', quantity: 2 },
          { ticketId: 'ticket2', quantity: 1 },
        ],
      } as any;

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);
      (mockPrismaClient.booking.delete as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.cancelBooking(bookingId);

      expect(result).toEqual(mockBooking);
      expect(mockPrismaClient.ticket.update).toHaveBeenCalledTimes(2);
      expect(mockPrismaClient.booking.delete).toHaveBeenCalledWith({
        where: { id: bookingId },
      });
    });

    it('should throw an error if booking is not found', async () => {
      const bookingId = 'nonexistent';

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(bookingService.cancelBooking(bookingId))
        .rejects.toThrow('Booking not found for id nonexistent');
    });
  });

  describe('verifyBooking', () => {
    it('should verify a valid booking', async () => {
      const bookingId = 'booking1';
      const verificationCode = 'ABCDE12345';
      const mockBooking = {
        id: bookingId,
        verificationCode,
        verified: false,
        event: { date: new Date(Date.now() + 86400000) }, // Tomorrow
      } as any;

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);
      (mockPrismaClient.booking.update as jest.Mock).mockResolvedValue({ ...mockBooking, verified: true } as any);

      const result = await bookingService.verifyBooking(bookingId, verificationCode);

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Booking verified successfully');
      expect(mockPrismaClient.booking.update).toHaveBeenCalledWith({
        where: { id: bookingId },
        data: { verified: true },
      });
    });

    it('should return invalid for non-existent booking', async () => {
      const bookingId = 'nonexistent';
      const verificationCode = 'ABCDE12345';

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await bookingService.verifyBooking(bookingId, verificationCode);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Booking not found');
    });

    it('should return invalid for already verified booking', async () => {
      const bookingId = 'booking1';
      const verificationCode = 'ABCDE12345';
      const mockBooking = {
        id: bookingId,
        verificationCode,
        verified: true,
        event: { date: new Date(Date.now() + 86400000) }, // Tomorrow
      } as any;

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.verifyBooking(bookingId, verificationCode);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Booking has already been verified');
    });

    it('should return invalid for incorrect verification code', async () => {
      const bookingId = 'booking1';
      const verificationCode = 'WRONG12345';
      const mockBooking = {
        id: bookingId,
        verificationCode: 'CORRECT12345',
        verified: false,
        event: { date: new Date(Date.now() + 86400000) }, // Tomorrow
      } as any;

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.verifyBooking(bookingId, verificationCode);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid verification code');
    });

    it('should return invalid for past events', async () => {
      const bookingId = 'booking1';
      const verificationCode = 'ABCDE12345';
      const mockBooking = {
        id: bookingId,
        verificationCode,
        verified: false,
        event: { date: new Date(Date.now() - 86400000) }, // Yesterday
      } as any;

      (mockPrismaClient.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

      const result = await bookingService.verifyBooking(bookingId, verificationCode);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('This event has already passed');
    });
  });

  describe('getVerifiedBookings', () => {
    it('should return all verified bookings', async () => {
      const mockVerifiedBookings = [
        { id: 'booking1', verified: true },
        { id: 'booking2', verified: true },
      ] as any[];

      (mockPrismaClient.booking.findMany as jest.Mock).mockResolvedValue(mockVerifiedBookings);

      const result = await bookingService.getVerifiedBookings();

      expect(result).toEqual(mockVerifiedBookings);
      expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith({
        where: { verified: true },
        include: { event: true, TicketBookings: true, user: true },
      });
    });
  });
});