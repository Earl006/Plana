import { PrismaClient, User } from '@prisma/client';
import path from 'path';
import sendMail from '../bg-services/email.service';
const prisma = new PrismaClient();

export class UserService {
  static async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  static async getAllUsers(skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      skip,
      take,
    });
  }

  static async requestManagerRole(userId: string): Promise<User> {
    const templatePath = path.join(__dirname, '../mails/request-manager.ejs');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const body ={
        user,
    }
    await sendMail({
        email: user.email,
        subject: 'EVENT MANAGER REQUEST',
        template: templatePath,
        body,
      });
    
    return prisma.user.update({
      where: { id: userId },
      data: { managerRequestStatus: 'PENDING' },
    });

    
  }

  static async approveManagerRequest(userId: string): Promise<User> {
    const templatePath = path.join(__dirname, '../mails/approve-request.ejs');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const body ={
        user,
    }
    await sendMail({
        email: user.email,
        subject: 'EVENT MANAGER REQUEST APPROVAL',
        template: templatePath,
        body,
      });
    return prisma.user.update({
      where: { id: userId },
      data: {
        role: 'EVENT_MANAGER',
        managerRequestStatus: 'APPROVED',
      },
    });
  }

  static async rejectManagerRequest(userId: string): Promise<User> {
    const templatePath = path.join(__dirname, '../mails/reject-request.ejs');
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const body ={
        user,
    }
    await sendMail({
        email: user.email,
        subject: 'EVENT MANAGER REQUEST REJECTION',
        template: templatePath,
        body,
      });
    return prisma.user.update({
      where: { id: userId },
      data: { 
        role: 'ATTENDEE',
        managerRequestStatus: 'REJECTED' },
    });
  }

  static async changeUserRole(userId: string, newRole: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  static async searchUsers(query: string, skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query} },
          { email: { contains: query} },
        ],
      },
      skip,
      take,
    });
  }

  static async getUserStats(): Promise<{ total: number, byRole: Record<string, number> }> {
    const total = await prisma.user.count();
    const byRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    const roleStats = byRole.reduce((acc, curr) => {
      acc[curr.role] = curr._count.role;
      return acc;
    }, {} as Record<string, number>);

    return { total, byRole: roleStats };
  }
}