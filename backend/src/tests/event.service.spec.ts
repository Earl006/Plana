import { EventService } from '../services/event.service';
import { PrismaClient, Event, Ticket } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinaryUtil';
import chatService from '../services/chat.service';

jest.mock('@prisma/client');
jest.mock('../path/to/utils/cloudinaryUtil');
jest.mock('../path/to/chat.service');

describe('EventService', () => {
  let eventService: EventService;
  let prismaClientMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaClientMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    (PrismaClient as jest.Mock).mockImplementation(() => prismaClientMock);
    eventService = new EventService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockEventData = {
        title: 'Test Event',
        description: 'Test Description',
        categoryId: 'category1',
        date: new Date(),
        location: 'Test Location',
        managerId: 'manager1',
      };
      const mockTickets = [{ type: 'VIP', price: 100, quantity: 50 }];
      const mockFile = {} as Express.Multer.File;
      const mockPosterUrl = 'http://example.com/poster.jpg';

      (uploadToCloudinary as jest.Mock).mockResolvedValue(mockPosterUrl);
      (chatService.createRoom as jest.Mock).mockResolvedValue(undefined);
      (prismaClientMock.event.create as jest.Mock).mockResolvedValue({ id: 'event1', ...mockEventData } as Event);

      const result = await eventService.createEvent(mockEventData, mockTickets, mockFile);

      expect(uploadToCloudinary).toHaveBeenCalledWith(mockFile);
      expect(chatService.createRoom).toHaveBeenCalledWith(mockEventData.title);
      expect(prismaClientMock.event.create).toHaveBeenCalledWith({
        data: {
          ...mockEventData,
          posterUrl: mockPosterUrl,
          tickets: {
            create: mockTickets
          }
        },
        include: {
          category: true,
          manager: true,
          tickets: true
        }
      });
      expect(result).toEqual(expect.objectContaining({ id: 'event1', ...mockEventData }));
    });
  });

  describe('getEvents', () => {
    it('should return paginated events', async () => {
      const mockEvents = [{ id: 'event1' }, { id: 'event2' }] as Event[];
      (prismaClientMock.event.findMany as jest.Mock).mockResolvedValue(mockEvents);
      (prismaClientMock.event.count as jest.Mock).mockResolvedValue(20);

      const result = await eventService.getEvents(1, 10);

      expect(prismaClientMock.event.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: expect.any(Object),
      });
      expect(result).toEqual({
        events: mockEvents,
        totalPages: 2,
        currentPage: 1,
      });
    });
  });

  describe('getEventById', () => {
    it('should return an event by id', async () => {
      const mockEvent = { id: 'event1', title: 'Test Event' } as Event;
      (prismaClientMock.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);

      const result = await eventService.getEventById('event1');

      expect(prismaClientMock.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'event1' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockEvent);
    });

    it('should throw an error if event is not found', async () => {
      (prismaClientMock.event.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(eventService.getEventById('nonexistent')).rejects.toThrow('Event not found');
    });
  });

  describe('getEventsByLocation', () => {
    it('should return events by location', async () => {
      const mockEvents = [{ id: 'event1', location: 'Test Location' }] as Event[];
      (prismaClientMock.event.findMany as jest.Mock).mockResolvedValue(mockEvents);

      const result = await eventService.getEventsByLocation('Test Location');

      expect(prismaClientMock.event.findMany).toHaveBeenCalledWith({
        where: { location: 'Test Location' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      const mockExistingEvent = { id: 'event1', title: 'Old Title' } as Event;
      const mockUpdateData = { title: 'New Title' };
      const mockTickets = [{ type: 'VIP', price: 100, quantity: 50 }];

      (prismaClientMock.event.findUnique as jest.Mock).mockResolvedValue(mockExistingEvent);
      (prismaClientMock.event.update as jest.Mock).mockResolvedValue({ ...mockExistingEvent, ...mockUpdateData } as Event);

      const result = await eventService.updateEvent('event1', mockUpdateData, mockTickets);

      expect(prismaClientMock.event.update).toHaveBeenCalledWith({
        where: { id: 'event1' },
        data: expect.objectContaining({
          title: 'New Title',
          tickets: {
            deleteMany: {},
            create: mockTickets,
          },
        }),
        include: expect.any(Object),
      });
      expect(result).toEqual(expect.objectContaining({ id: 'event1', title: 'New Title' }));
    });

    it('should throw an error if event is not found', async () => {
      (prismaClientMock.event.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(eventService.updateEvent('nonexistent', {}, [])).rejects.toThrow('Event not found');
    });
  });

  describe('updateEventPoster', () => {
    it('should update event poster successfully', async () => {
      const mockFile = {} as Express.Multer.File;
      const mockPosterUrl = 'http://example.com/new-poster.jpg';
      const mockUpdatedEvent = { id: 'event1', posterUrl: mockPosterUrl } as Event;

      (uploadToCloudinary as jest.Mock).mockResolvedValue(mockPosterUrl);
      (prismaClientMock.event.update as jest.Mock).mockResolvedValue(mockUpdatedEvent);

      const result = await eventService.updateEventPoster('event1', mockFile);

      expect(uploadToCloudinary).toHaveBeenCalledWith(mockFile);
      expect(prismaClientMock.event.update).toHaveBeenCalledWith({
        where: { id: 'event1' },
        data: { posterUrl: mockPosterUrl },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockUpdatedEvent);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      const mockEvent = { id: 'event1' } as Event;
      (prismaClientMock.event.findUnique as jest.Mock).mockResolvedValue(mockEvent);
      (prismaClientMock.booking.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prismaClientMock.ticket.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prismaClientMock.event.delete as jest.Mock).mockResolvedValue(mockEvent);

      await eventService.deleteEvent('event1');

      expect(prismaClientMock.booking.deleteMany).toHaveBeenCalledWith({ where: { eventId: 'event1' } });
      expect(prismaClientMock.ticket.deleteMany).toHaveBeenCalledWith({ where: { eventId: 'event1' } });
      expect(prismaClientMock.event.delete).toHaveBeenCalledWith({ where: { id: 'event1' } });
    });

    it('should throw an error if event is not found', async () => {
      (prismaClientMock.event.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(eventService.deleteEvent('nonexistent')).rejects.toThrow('Event not found');
    });
  });

  describe('getEventsByCategory', () => {
    it('should return paginated events by category', async () => {
      const mockEvents = [{ id: 'event1', categoryId: 'category1' }] as Event[];
      (prismaClientMock.event.findMany as jest.Mock).mockResolvedValue(mockEvents);
      (prismaClientMock.event.count as jest.Mock).mockResolvedValue(20);

      const result = await eventService.getEventsByCategory('category1', 1, 10);

      expect(prismaClientMock.event.findMany).toHaveBeenCalledWith({
        where: { categoryId: 'category1' },
        skip: 0,
        take: 10,
        include: expect.any(Object),
      });
      expect(result).toEqual({
        events: mockEvents,
        totalPages: 2,
        currentPage: 1,
      });
    });
  });

  describe('getEventsByManager', () => {
    it('should return paginated events by manager', async () => {
      const mockEvents = [{ id: 'event1', managerId: 'manager1' }] as Event[];
      (prismaClientMock.event.findMany as jest.Mock).mockResolvedValue(mockEvents);
      (prismaClientMock.event.count as jest.Mock).mockResolvedValue(20);

      const result = await eventService.getEventsByManager('manager1', 1, 10);

      expect(prismaClientMock.event.findMany).toHaveBeenCalledWith({
        where: { managerId: 'manager1' },
        skip: 0,
        take: 10,
        include: expect.any(Object),
      });
      expect(result).toEqual({
        events: mockEvents,
        totalPages: 2,
        currentPage: 1,
      });
    });
  });
});