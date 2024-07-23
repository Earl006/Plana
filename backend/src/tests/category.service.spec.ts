import { PrismaClient, Category } from '@prisma/client';
import { CategoryService } from '../services/category.service';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    category: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient = new PrismaClient() as jest.Mocked<PrismaClient>;
    categoryService = new CategoryService();
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.createCategory('Test Category');

      expect(result).toEqual(mockCategory);
      expect(mockPrismaClient.category.create).toHaveBeenCalledWith({
        data: { name: 'Test Category' },
      });
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'Category 1', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Category 2', createdAt: new Date(), updatedAt: new Date() },
      ];

      (mockPrismaClient.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryService.getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrismaClient.category.findMany).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category when it exists', async () => {
      const mockCategory: Category = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.getCategoryById('1');

      expect(result).toEqual(mockCategory);
      expect(mockPrismaClient.category.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when category does not exist', async () => {
      (mockPrismaClient.category.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.getCategoryById('nonexistent');

      expect(result).toBeNull();
      expect(mockPrismaClient.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent' },
      });
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const mockUpdatedCategory: Category = {
        id: '1',
        name: 'Updated Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.category.update as jest.Mock).mockResolvedValue(mockUpdatedCategory);

      const result = await categoryService.updateCategory('1', 'Updated Category');

      expect(result).toEqual(mockUpdatedCategory);
      expect(mockPrismaClient.category.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Category' },
      });
    });

    it('should throw an error when updating non-existent category', async () => {
      (mockPrismaClient.category.update as jest.Mock).mockRejectedValue(new Error('Category not found'));

      await expect(categoryService.updateCategory('nonexistent', 'New Name'))
        .rejects.toThrow('Category not found');
    });
  });

  describe('deleteCategory', () => {
    it('should delete an existing category', async () => {
      const mockDeletedCategory: Category = {
        id: '1',
        name: 'Deleted Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrismaClient.category.delete as jest.Mock).mockResolvedValue(mockDeletedCategory);

      const result = await categoryService.deleteCategory('1');

      expect(result).toEqual(mockDeletedCategory);
      expect(mockPrismaClient.category.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error when deleting non-existent category', async () => {
      (mockPrismaClient.category.delete as jest.Mock).mockRejectedValue(new Error('Category not found'));

      await expect(categoryService.deleteCategory('nonexistent'))
        .rejects.toThrow('Category not found');
    });
  });
});