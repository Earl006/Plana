import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
    async createCategory(name: string): Promise<Category> {
      return prisma.category.create({
        data: { name },
      });
    }
  
    async getAllCategories(): Promise<Category[]> {
      return prisma.category.findMany();
    }
  
    async getCategoryById(id: string): Promise<Category | null> {
      return prisma.category.findUnique({
        where: { id },
      });
    }
  
    async updateCategory(id: string, name: string): Promise<Category> {
      return prisma.category.update({
        where: { id },
        data: { name },
      });
    }
  
    async deleteCategory(id: string): Promise<Category> {
      return prisma.category.delete({
        where: { id },
      });
    }
  }
  
  export const categoryService = new CategoryService();