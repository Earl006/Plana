import { Request, Response } from 'express';
import chatService from '../services/chat.service';

const createRoom = async (req: Request, res: Response) => {
  const { name } = req.body;
  const room = await chatService.createRoom(name);
  res.json(room);
};

const getRoomMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const messages = await chatService.getRoomMessages(roomId);
  res.json(messages);
};

const createMessage = async (req: Request, res: Response) => {
  const { roomId, userId, message } = req.body;
  const msg = await chatService.createMessage(roomId, userId, message);
  res.json(msg);
};

export default {
  createRoom,
  getRoomMessages,
  createMessage
};
