import express from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth.middleware';
import { upload } from '../utils/cloudinaryUtil';

const router = express.Router();
const eventController = new EventController();

router.post('/create', authenticateJWT, authorizeRole(['EVENT_MANAGER']),upload.single('poster'), eventController.createEvent);
router.get('/all', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.put('/update/:id', authenticateJWT, authorizeRole(['EVENT_MANAGER']),eventController.updateEvent);
router.delete('/:id', authenticateJWT, authorizeRole(['EVENT_MANAGER', 'ADMIN']), eventController.deleteEvent);
router.get('/category/:categoryId', eventController.getEventsByCategory);
router.get('/location/:location', eventController.getEventsByLocation);
router.get('/manager/:managerId', eventController.getEventsByManager);
router.put('/update-poster/:id', authenticateJWT, authorizeRole(['EVENT_MANAGER']), upload.single('poster'), eventController.updateEventPoster);


export default router;