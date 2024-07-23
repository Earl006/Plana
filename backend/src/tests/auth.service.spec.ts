import { AuthService } from '../services/auth.service';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwt.utils';
import sendMail from '../bg-services/email.service';
import { v4 as uuidv4 } from 'uuid';

jest.mock('@prisma/client');
jest.mock('bcrypt');
jest.mock('../utils/jwt.utils');
jest.mock('../bg-services/email.service');
jest.mock('uuid');

describe('AuthService', () => {
  let prismaClientMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaClientMock = new PrismaClient() as jest.Mocked<PrismaClient>;
    (PrismaClient as jest.Mock).mockImplementation(() => prismaClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'mockId',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        role: 'ATTENDEE',
        managerRequestStatus: 'NOT-REQUESTED',
      };

      (prismaClientMock.user.findUnique as any).mockResolvedValue(null);
      (prismaClientMock.user.create as any).mockResolvedValue(mockUser as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (sendMail as jest.Mock).mockResolvedValue(undefined);
      (uuidv4 as jest.Mock).mockReturnValue('mockId');

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      });

      expect(result).toEqual({ user: mockUser });
      expect(prismaClientMock.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          id: 'mockId',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          role: 'ATTENDEE',
          managerRequestStatus: 'NOT-REQUESTED',
        }),
      }));
      expect(sendMail).toHaveBeenCalled();
    });

    it('should throw an error if user already exists', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existingId' } as User);

      await expect(AuthService.register({
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      })).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 'mockId',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        role: 'ATTENDEE',
      };

      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        user: mockUser,
        token: 'mockToken',
      });
    });

    it('should throw an error for invalid credentials', async () => {
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      })).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error for incorrect password', async () => {
      const mockUser = {
        id: 'mockId',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      };

      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 'mockId', email: 'test@example.com' };
      (prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);

      const result = await AuthService.getUserById('mockId');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
     ( prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.getUserById('nonexistentId');
      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockUser = {
        id: 'mockId',
        passwordHash: 'oldHashedPassword',
      };

      ( prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, passwordHash: 'newHashedPassword' } as User);

      const result = await AuthService.changePassword('mockId', 'oldPassword', 'newPassword');
      expect(result).toEqual(expect.objectContaining({ id: 'mockId', passwordHash: 'newHashedPassword' }));
    });

    it('should throw an error if user not found', async () => {
        ( prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.changePassword('nonexistentId', 'oldPassword', 'newPassword'))
        .rejects.toThrow('User not found');
    });

    it('should throw an error if old password is incorrect', async () => {
      const mockUser = {
        id: 'mockId',
        passwordHash: 'oldHashedPassword',
      };

      ( prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(AuthService.changePassword('mockId', 'wrongOldPassword', 'newPassword'))
        .rejects.toThrow('Invalid old password');
    });
  });

  describe('requestPasswordReset', () => {
    it('should generate reset token successfully', async () => {
      const mockUser = {
        id: 'mockId',
        email: 'test@example.com',
      };

      ( prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser as User);
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, resetToken: '1234' } as User);
      (sendMail as jest.Mock).mockResolvedValue(undefined);

      const result = await AuthService.requestPasswordReset('test@example.com');
      expect(result).toMatch(/^\d{4}$/);
      expect(prismaClientMock.user.update).toHaveBeenCalled();
      expect(sendMail).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
        ( prismaClientMock.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.requestPasswordReset('nonexistent@example.com'))
        .rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const mockUser = {
        id: 'mockId',
        resetToken: '1234',
        resetTokenExpiry: new Date(Date.now() + 1000000),
      };

     ( prismaClientMock.user.findFirst as jest.Mock).mockResolvedValue(mockUser as User);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (prismaClientMock.user.update as jest.Mock).mockResolvedValue({ ...mockUser, passwordHash: 'newHashedPassword', resetToken: null, resetTokenExpiry: null } as User);

      const result = await AuthService.resetPassword('1234', 'newPassword');
      expect(result).toEqual(expect.objectContaining({
        id: 'mockId',
        passwordHash: 'newHashedPassword',
        resetToken: null,
        resetTokenExpiry: null,
      }));
    });

    it('should throw an error if reset token is invalid or expired', async () => {
      (prismaClientMock.user.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.resetPassword('invalidToken', 'newPassword'))
        .rejects.toThrow('Invalid or expired reset token');
    });
  });
});