// import { PrismaClient, Room, Message, User } from "@prisma/client";
// import chatService from "../services/chat.service";

// // Mock PrismaClient
// jest.mock("../app", () => ({
//   prisma: {
//     room: {
//       create: jest.fn(),
//     },
//     message: {
//       findMany: jest.fn(),
//       create: jest.fn(),
//     },
//   },
// }));

// describe("Chat Service", () => {
//   let mockPrisma: jest.Mocked<PrismaClient>;

//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockPrisma = require("../app").prisma as jest.Mocked<PrismaClient>;
//   });

//   describe("createRoom", () => {
//     it("should create a new room", async () => {
//       const mockRoom: Room = {
//         id: "room1",
//         name: "Test Room",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       (mockPrisma.room.create as jest.Mock).mockResolvedValue(mockRoom);

//       const result = await chatService.createRoom("Test Room");

//       expect(result).toEqual(mockRoom);
//       expect(mockPrisma.room.create).toHaveBeenCalledWith({
//         data: { name: "Test Room" },
//       });
//     });
//   });

//   describe("getRoomMessages", () => {
//     it("should return messages for a given room", async () => {
//       const mockUser: User = {
//         id: "user1",
//         email: "test@example.com",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         firstName: "",
//         lastName: "",
//         avatarUrl: "",
//         role: "",
//         managerRequestStatus: null,
//         resetToken: null,
//         resetTokenExpiry: null,
//       };

//       const mockMessages: (Message & { sender: User })[] = [
//         {
//           id: "msg1",
//           content: "Hello",
//           senderId: "user1",
//           roomId: "room1",
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           sender: mockUser,
//         },
//         {
//           id: "msg2",
//           content: "World",
//           senderId: "user1",
//           roomId: "room1",
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           sender: mockUser,
//         },
//       ];

//       mockPrisma.message.findMany.mockResolvedValue(mockMessages);

//       const result = await chatService.getRoomMessages("room1");

//       expect(result).toEqual(mockMessages);
//       expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
//         where: { roomId: "room1" },
//         include: { sender: true },
//       });
//     });
//   });

//   describe("createMessage", () => {
//     it("should create a new message", async () => {
//       const mockUser: User = {
//         id: "user1",
//         name: "Test User",
//         email: "test@example.com",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       const mockMessage: Message & { sender: User } = {
//         id: "msg1",
//         content: "Hello, World!",
//         senderId: "user1",
//         roomId: "room1",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         sender: mockUser,
//       };

//       (mockPrisma.message.create as jest.Mock).mockResolvedValue(mockMessage);

//       const result = await chatService.createMessage("room1", "user1", "Hello, World!");

//       expect(result).toEqual(mockMessage);
//       expect(mockPrisma.message.create).toHaveBeenCalledWith({
//         data: {
//           content: "Hello, World!",
//           senderId: "user1",
//           roomId: "room1",
//         },
//         include: {
//           sender: true,
//         },
//       });
//     });
//   });
// });