import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export class EventController {
  async createEvent(req: Request, res: Response) {
    const { title, description, categoryId, date, location, tickets } = req.body;
    
    if (!req.user) {
      throw Error('User not authenticated');
    }
    
    const managerId = req.user.userId;
    const posterFile = req.file;

    if (!posterFile) {
      throw new Error('Event poster is required');
    }

    const eventData = {
      title,
      description,
      categoryId,
      date: new Date(date),
      location,
      managerId
    };

    const parsedTickets = JSON.parse(tickets);

    const event = await eventService.createEvent(eventData, parsedTickets, posterFile);
    res.status(201).json(event);
  }

  async getEvents(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.getEvents(page, limit);
    res.json(events);
  }

  async getEventById(req: Request, res: Response) {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    res.json(event);
  }

  async getEventsByLocation(req: Request, res: Response) {
    const { location } = req.params;

    try {
      const events = await eventService.getEventsByLocation(location);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateEvent(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, categoryId, date, location, tickets } = req.body;

    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const managerId = req.user.userId;

    const updateData = {
      title,
      description,
      categoryId,
      date: date ? new Date(date) : undefined,
      location,
      managerId
    };

    let parsedTickets = [];
    if (tickets) {
      try {
        parsedTickets = JSON.parse(tickets);
      } catch (error) {
        return res.status(400).json({ error: 'Invalid tickets format' });
      }
    }

    try {
      const updatedEvent = await eventService.updateEvent(id, updateData, parsedTickets);
      res.status(200).json(updatedEvent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateEventPoster(req: Request, res: Response) {
    const { id } = req.params;
    const posterFile = req.file;

    if (!posterFile) {
      return res.status(400).json({ error: 'Poster file is required' });
    }

    try {
      const updatedEvent = await eventService.updateEventPoster(id, posterFile);
      res.status(200).json(updatedEvent);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;
    await eventService.deleteEvent(id);
    res.status(204).end();
  }

  async getEventsByCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.getEventsByCategory(categoryId, page, limit);
    res.json(events);
  }

  async getEventsByManager(req: Request, res: Response) {
    const { managerId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.getEventsByManager(managerId, page, limit);
    res.json(events);
  }
}