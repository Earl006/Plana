import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, verifyToken } from '../utils/jwt.utils';
import sendMail from '../bg-services/email.service';
import path from 'path';

const prisma = new PrismaClient();

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserPayload {
  userId: string;  // Changed from 'id' to 'userId' to be more explicit
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: string; // Added phoneNumber property
}

export class AuthService {
  static async register(data: RegisterData): Promise<{ user: User;}> {
    const { email, password, firstName, lastName, phoneNumber } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        passwordHash,
        firstName,
        lastName,
        phoneNumber,
        role: 'ATTENDEE', // Default role as string
        managerRequestStatus: 'NOT-REQUESTED', // Default status as string
      },
    });

    const templatePath = path.join(__dirname, '../mails/welcome-mail.ejs');
    const body = {
      user,
    };

    await sendMail({
      email: user.email,
      subject: 'Welcome to Plana',
      template: templatePath,
      body,
    });

    return { user };
  }

  static async login(data: LoginData): Promise<{ user: User; token: string }> {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    return { user, token };
  }

  static async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user with new password
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  static async requestPasswordReset(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const generateResetCode: () => string = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    // Generate reset token
    const resetToken = generateResetCode();
    const resetTokenExpiry = new Date(Date.now() + 900000); // 15 minutes

    // Save reset token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const templatePath = path.join(__dirname, '../mails/reset-password.ejs');
    const body = {
      user,
      resetToken,
    };

    await sendMail({
      email: user.email,
      subject: 'Reset your password - Plana',
      template: templatePath,
      body,
    });

    return resetToken;
  }

  static async resetPassword(resetToken: string, newPassword: string): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update user with new password and clear reset token
    return prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }
}
