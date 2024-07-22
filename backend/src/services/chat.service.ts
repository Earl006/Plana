import { PrismaClient } from "@prisma/client";
import { prisma } from "../app";

const createRoom = async (name: string) => {

  return await prisma.room.create({ data: { name } });
};

const getRoomMessages = async (roomId: string) => {
  return await prisma.message.findMany({
    where: { roomId },
    include: { sender: true }
  });
};

const createMessage = async (roomId: string, userId: string, content: string) => {
  return await prisma.message.create({
    data: {
      content,
      senderId: userId,
      roomId
    },
    include: {
      sender: true
    }
  });
};

export default {
  createRoom,
  getRoomMessages,
  createMessage
};
