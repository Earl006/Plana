import { PrismaClient, Event, Ticket, Prisma } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinaryUtil';
import chatService from './chat.service';

const prisma = new PrismaClient();

export class EventService {
  async createEvent(
    eventData: {
      title: string;
      description: string;
      categoryId: string;
      date: Date;
      location: string;
      managerId: string;
    },
    tickets: {
      type: string;
      price: number;
      quantity: number;
    }[],
    posterFile: Express.Multer.File
  ) {
    const posterUrl = await uploadToCloudinary(posterFile);

    await chatService.createRoom(eventData.title);

    return prisma.event.create({
      data: {
        ...eventData,
        posterUrl,
        tickets: {
          create: tickets
        }
      },
      include: {
        category: true,
        manager: true,
        tickets: true
      }
    });
  }

  async getEvents(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip,
        take: limit,
        include: {
          category: true,
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          tickets: true
        },
      }),
      prisma.event.count(),
    ]);

    return {
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getEventById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        tickets: true
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  async getEventsByLocation(location: string) {
    return prisma.event.findMany({
      where: { location },
      include: {
        category: true,
        manager: true,
        tickets: true,
      },
    });
  }

  async updateEvent(eventId: string, updateData: any, tickets: any[]) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { tickets: true }
    });

    if (!existingEvent) {
      throw new Error('Event not found');
    }

    const updatedData = {
      title: updateData.title || existingEvent.title,
      description: updateData.description || existingEvent.description,
      date: updateData.date ? new Date(updateData.date) : existingEvent.date,
      location: updateData.location || existingEvent.location,
      categoryId: updateData.categoryId || existingEvent.categoryId
    };

    return prisma.event.update({
      where: { id: eventId },
      data: {
        ...updatedData,
        tickets: {
          deleteMany: {}, 
          create: tickets.map(ticket => ({
            type: ticket.type,
            price: ticket.price,
            quantity: ticket.quantity
          }))
        }
      },
      include: {
        category: true,
        manager: true,
        tickets: true
      }
    });
  }

  async updateEventPoster(eventId: string, posterFile: Express.Multer.File) {
    try {
      const posterUrl = await uploadToCloudinary(posterFile);

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { posterUrl },
        include: {
          category: true,
          manager: true,
          tickets: true,
        },
      });

      return updatedEvent;
    } catch (error) {
      console.error('Error updating event poster:', error);
      throw new Error('Failed to update event poster');
    }
  }

  async deleteEvent(id: string) {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new Error('Event not found');
    }

    await prisma.booking.deleteMany({ where: { eventId: id } });
    await prisma.ticket.deleteMany({ where: { eventId: id } });

    return prisma.event.delete({ where: { id } });
  }

  async getEventsByCategory(categoryId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { categoryId },
        skip,
        take: limit,
        include: {
          category: true,
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          tickets: true
        },
      }),
      prisma.event.count({ where: { categoryId } }),
    ]);

    return {
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getEventsByManager(managerId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { managerId },
        skip,
        take: limit,
        include: {
          category: true,
          tickets: true
        },
      }),
      prisma.event.count({ where: { managerId } }),
    ]);

    return {
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}