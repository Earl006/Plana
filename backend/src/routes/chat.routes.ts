import express from 'express';
import chatController from '../controllers/chat.controller';

const router = express.Router();

router.post('/rooms', chatController.createRoom);
router.get('/rooms/:roomId/messages', chatController.getRoomMessages);
router.post('/messages', chatController.createMessage);

export default router;
