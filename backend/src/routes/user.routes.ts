import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/:id', UserController.getUserById);
router.get('/email/:email', UserController.getUserByEmail);
router.put('/update/:id', UserController.updateUser);
router.delete('/:id', authenticateJWT, UserController.deleteUser);
router.get('/all/users', authenticateJWT, isAdmin, UserController.getAllUsers);
router.post('/request-manager', authenticateJWT, UserController.requestManagerRole);
router.post('/approve-manager', authenticateJWT, isAdmin, UserController.approveManagerRequest);
router.post('/reject-manager', authenticateJWT, isAdmin, UserController.rejectManagerRequest);
router.post('/change-role', authenticateJWT, isAdmin, UserController.changeUserRole);
router.get('/s/search-users', authenticateJWT, isAdmin, UserController.searchUsers);
router.get('/u/stats', authenticateJWT, isAdmin, UserController.getUserStats);
router.get('/manager/all', authenticateJWT, isAdmin, UserController.getManagers);
router.get('/manager/requests', authenticateJWT, isAdmin, UserController.getManagerRequests);
router.get('/auth/isAdmin', authenticateJWT, isAdmin, UserController.isAdmin);
router.get('/auth/isManager', authenticateJWT, isAdmin, UserController.isEventManager);
router.get('/auth/isUser', authenticateJWT, isAdmin, UserController.isAttendee);

export default router;
