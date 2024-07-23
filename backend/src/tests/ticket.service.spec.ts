import { TicketService } from '../services/ticket.service';
import { PrismaClient, Booking, Ticket } from '@prisma/client';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

jest.mock('@prisma/client');
jest.mock('qrcode');
jest.mock('fs');
jest.mock('path');

describe('TicketService', () => {
  let ticketService: TicketService;
  let prismaClientMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaClientMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    (PrismaClient as jest.Mock).mockImplementation(() => prismaClientMock);
    ticketService = new TicketService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTicket', () => {
    it('should generate a ticket successfully', async () => {
      const mockBooking = {
        id: 'booking1',
        verificationCode: 'VC123',
        user: { firstName: 'John', lastName: 'Doe' },
        event: { title: 'Test Event' },
        TicketBookings: [{ ticket: { type: 'VIP' } }],
      } as unknown as Booking & { user: any; event: any; TicketBookings: { ticket: Ticket }[] };

      const attendeeDetails = { firstName: 'Jane', lastName: 'Doe', ticketType: 'VIP' };

      (prismaClientMock.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);
      (QRCode.toDataURL as jest.Mock).mockResolvedValue('mock-qr-code-data-url');
      (path.join as jest.Mock).mockReturnValue('/mock/path/ticket.pdf');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

      const result = await ticketService.generateTicket('booking1', attendeeDetails);

      expect(prismaClientMock.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 'booking1' },
        include: expect.any(Object),
      });
      expect(QRCode.toDataURL).toHaveBeenCalledWith('VC123');
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(result).toBe('/mock/path/ticket.pdf');
    });

    it('should throw an error if booking is not found', async () => {
      (prismaClientMock.booking.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(ticketService.generateTicket('nonexistent', { firstName: 'Jane', lastName: 'Doe', ticketType: 'VIP' }))
        .rejects.toThrow('Booking not found');
    });
  });

  
});