import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await categoryService.createCategory(name);
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Error adding category' });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({message: 'Categories found', categories});
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (category) {
      res.json({message: 'Category found', category});
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Category does not exist' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryService.updateCategory(id, name);
    res.json({message: 'Category updated', category});
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Category does not exist' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    res.status(204).json({message: 'Product deleted succesfully'});
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Category does not exist' });
  }
};