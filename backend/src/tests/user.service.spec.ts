import { UserService } from '../services/user.service';
import { PrismaClient, User } from '@prisma/client';
import sendMail from '../bg-services/email.service';

jest.mock('@prisma/client');
jest.mock('../bg-services/email.service.ts');

describe('UserService', () => {
  let prismaClientMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaClientMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    (PrismaClient as jest.Mock).mockImplementation(() => prismaClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);

      const result = await UserService.getUserById('userId');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await UserService.getUserById('nonexistentId');
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);

      const result = await UserService.getUserByEmail('user@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await UserService.getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com', firstName: 'John' };
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue(mockUser as User);

      const result = await UserService.updateUser('userId', { firstName: 'John' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      (prismaClientMock.user.delete as jest.Mock).mockResolvedValue(mockUser as User);

      const result = await UserService.deleteUser('userId');
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return users with default pagination', async () => {
      const mockUsers = [{ id: 'user1' }, { id: 'user2' }];
      (prismaClientMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers as User[]);

      const result = await UserService.getAllUsers();
      expect(result).toEqual(mockUsers);
      expect(prismaClientMock.user.findMany).toHaveBeenCalledWith({ skip: 0, take: 10 });
    });

    it('should return users with custom pagination', async () => {
      const mockUsers = [{ id: 'user1' }, { id: 'user2' }];
      (prismaClientMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers as User[]);

      const result = await UserService.getAllUsers(5, 20);
      expect(result).toEqual(mockUsers);
      expect(prismaClientMock.user.findMany).toHaveBeenCalledWith({ skip: 5, take: 20 });
    });
  });

  describe('getManagers', () => {
    it('should return managers', async () => {
      const mockManagers = [{ id: 'manager1', role: 'EVENT_MANAGER' }];
      (prismaClientMock.user.findMany as jest.Mock).mockResolvedValue(mockManagers as User[]);

      const result = await UserService.getManagers();
      expect(result).toEqual(mockManagers);
      expect(prismaClientMock.user.findMany).toHaveBeenCalledWith({
        where: { role: 'EVENT_MANAGER' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getManagerRequests', () => {
    it('should return manager requests', async () => {
      const mockRequests = [{ id: 'request1', managerRequestStatus: 'PENDING' }];
      (prismaClientMock.user.findMany as jest.Mock).mockResolvedValue(mockRequests as User[]);

      const result = await UserService.getManagerRequests();
      expect(result).toEqual(mockRequests);
      expect(prismaClientMock.user.findMany).toHaveBeenCalledWith({
        where: { managerRequestStatus: 'PENDING' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('requestManagerRole', () => {
    it('should request manager role successfully', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, managerRequestStatus: 'PENDING' } as User);

      const result = await UserService.requestManagerRole('userId');
      expect(result).toEqual({ ...mockUser, managerRequestStatus: 'PENDING' });
      expect(sendMail).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(UserService.requestManagerRole('nonexistentId')).rejects.toThrow('User not found');
    });
  });

  describe('approveManagerRequest', () => {
    it('should approve manager request successfully', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, role: 'EVENT_MANAGER', managerRequestStatus: 'APPROVED' } as User);

      const result = await UserService.approveManagerRequest('userId');
      expect(result).toEqual({ ...mockUser, role: 'EVENT_MANAGER', managerRequestStatus: 'APPROVED' });
      expect(sendMail).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(UserService.approveManagerRequest('nonexistentId')).rejects.toThrow('User not found');
    });
  });

  describe('isAttendee', () => {
    it('should return true for attendee', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ATTENDEE' } as User);

      const result = await UserService.isAttendee('userId');
      expect(result).toBe(true);
    });

    it('should return false for non-attendee', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ role: 'EVENT_MANAGER' } as User);

      const result = await UserService.isAttendee('userId');
      expect(result).toBe(false);
    });
  });

  describe('isEventManager', () => {
    it('should return true for event manager', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ role: 'EVENT_MANAGER' } as User);

      const result = await UserService.isEventManager('userId');
      expect(result).toBe(true);
    });

    it('should return false for non-event manager', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ATTENDEE' } as User);

      const result = await UserService.isEventManager('userId');
      expect(result).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ADMIN' } as User);

      const result = await UserService.isAdmin('userId');
      expect(result).toBe(true);
    });

    it('should return false for non-admin', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ role: 'ATTENDEE' } as User);

      const result = await UserService.isAdmin('userId');
      expect(result).toBe(false);
    });
  });

  describe('rejectManagerRequest', () => {
    it('should reject manager request successfully', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, role: 'ATTENDEE', managerRequestStatus: 'REJECTED' } as User);

      const result = await UserService.rejectManagerRequest('userId');
      expect(result).toEqual({ ...mockUser, role: 'ATTENDEE', managerRequestStatus: 'REJECTED' });
      expect(sendMail).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(UserService.rejectManagerRequest('nonexistentId')).rejects.toThrow('User not found');
    });
  });

  describe('changeUserRole', () => {
    it('should change user role successfully', async () => {
      const mockUser = { id: 'userId', role: 'ATTENDEE' };
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, role: 'EVENT_MANAGER' } as User);

      const result = await UserService.changeUserRole('userId', 'EVENT_MANAGER');
      expect(result).toEqual({ ...mockUser, role: 'EVENT_MANAGER' });
    });
  });

  describe('searchUsers', () => {
    it('should search users successfully', async () => {
      const mockUsers = [{ id: 'user1', firstName: 'John', email: 'john@example.com', phoneNumber: '1234567890', passwordHash: 'hashedPassword', lastName: 'Doe', avatarUrl: 'avatar.jpg', role: 'ATTENDEE', managerRequestStatus: null, createdAt: new Date(), updatedAt: new Date(), resetToken: null, resetTokenExpiry: null }];
      (prismaClientMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers as User[]);

      const result = await UserService.searchUsers('John');
      expect(result).toEqual(mockUsers);
      expect(prismaClientMock.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { firstName: { contains: 'John' } },
            { lastName: { contains: 'John' } },
            { email: { contains: 'John' } },
          ],
        },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      (prismaClientMock.user.count as jest.Mock).mockResolvedValue(100);
     ( prismaClientMock.user.groupBy as jest.Mock).mockResolvedValue([
        { role: 'ATTENDEE', _count: { role: 80 } },
        { role: 'EVENT_MANAGER', _count: { role: 15 } },
        { role: 'ADMIN', _count: { role: 5 } },
      ] as any);

      const result = await UserService.getUserStats();
      expect(result).toEqual({
        total: 100,
        byRole: {
          ATTENDEE: 80,
          EVENT_MANAGER: 15,
          ADMIN: 5,
        },
      });
    });
  });
});