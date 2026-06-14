import express from 'express';
import { verifyToken, authorizeRoles } from '../../middlewares/auth.middleware.js';
import { getDashboardStats } from './admin.controller.js';

const router = express.Router();

// Get Admin Stats
router.get('/stats', verifyToken, authorizeRoles('ADMIN'), getDashboardStats);

export default router;