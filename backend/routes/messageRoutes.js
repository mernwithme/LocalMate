import express from 'express';
import { getMessages, sendMessage, getConversations } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/conversations/list', getConversations);
router.get('/:recipientId', getMessages);
router.post('/', sendMessage);

export default router;
