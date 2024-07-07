import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import {authenticateJWT,isAdmin} from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create',authenticateJWT,isAdmin, createCategory);
router.get('/all', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', authenticateJWT, isAdmin, updateCategory);
router.delete('/:id',authenticateJWT, isAdmin, deleteCategory);

export default router;