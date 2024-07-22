import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.params;
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await UserService.updateUser(id, data);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(id);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { skip, take } = req.query;
      const users = await UserService.getAllUsers(Number(skip) || 0, Number(take) || 10);
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async getManagers(req: Request, res: Response): Promise<Response> {
    try {
      const { skip, take } = req.query;
      const users = await UserService.getManagers(Number(skip) || 0, Number(take) || 10);
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async getManagerRequests(req: Request, res: Response): Promise<Response> {
    try {
      const { skip, take } = req.query;
      const users = await UserService.getManagerRequests(Number(skip) || 0, Number(take) || 10);
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async isAttendee(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const user = await UserService.isAttendee(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async isEventManager(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const user = await UserService.isEventManager(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async isAdmin(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const user = await UserService.isAdmin(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  static async requestManagerRole(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const user = await UserService.requestManagerRole(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async approveManagerRequest(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const user = await UserService.approveManagerRequest(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async rejectManagerRequest(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;
      const user = await UserService.rejectManagerRequest(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async changeUserRole(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, newRole } = req.body;
      const user = await UserService.changeUserRole(userId, newRole);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async searchUsers(req: Request, res: Response): Promise<Response> {
    const query = req.query.q as string || '';
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 10;
    try {
      const users = await UserService.searchUsers(query, skip, take);
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserStats(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await UserService.getUserStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
