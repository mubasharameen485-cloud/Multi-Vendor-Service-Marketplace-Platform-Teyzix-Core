import express from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { getChatHistory, saveMessage, deleteMyMessage } from './chat.controller.js';

const router = express.Router();

// Get chat history with a specific user
router.get('/:receiverId', verifyToken, getChatHistory);

// Send/Save message
router.post('/', verifyToken, saveMessage);

// Delete my specific message
router.delete('/:messageId', verifyToken, deleteMyMessage);

export default router;